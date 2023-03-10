import axios from 'axios';
import config from '../config';

const baseUrl = config.apiBaseUrl;
const { cloudinaryName, cloudinaryKey } = config;

export default class ApiService {
  constructor() {
    this.accessToken = '';

    this.instance = axios.create({
      baseURL: baseUrl,
    });
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;

    if (accessToken) {
      this.instance = axios.create({
        baseURL: baseUrl,
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      return;
    }

    this.instance = axios.create({
      baseURL: baseUrl,
    });
  }

  async countUser(email) {
    const { data } = await this.instance.get(`/users/count?email=${email}`);

    return data.count;
  }

  async createUser({
    displayName, email, password,
  }) {
    const { data } = await this.instance.post('/users', {
      displayName, email, password,
    });

    return {
      id: data.id,
    };
  }

  async fetchMe() {
    const { data } = await this.instance.get('/users/me');

    return {
      id: data.id,
      displayName: data.displayName,
      about: data.about,
      points: data.points,
      realName: data.realName,
      imageUrl: data.imageUrl,
      countOfLikes: data.countOfLikes,
      tags: data.tags,
    };
  }

  async editProfile({
    displayName,
    about,
    imageUrl,
    tags,
  }) {
    await this.instance.patch('/users/me', {
      displayName,
      about,
      imageUrl,
      tags: [...tags],
    });
  }

  async changeName(name) {
    await this.instance.patch('/users/me/name', {
      name,
    });
  }

  async postSession({
    email, password,
  }) {
    const { data } = await this.instance.post('/session', {
      email, password,
    });

    return {
      accessToken: data.accessToken,
    };
  }

  async postTrialSession() {
    const { data } = await this.instance.post('/session/trial');

    return {
      accessToken: data.accessToken,
    };
  }

  async fetchUsers({ sort, keyword }) {
    const { data } = await this.instance.get(`/users?sort=${sort}&keyword=${keyword}&size=30`);

    return {
      users: data.users,
    };
  }

  async fetchUser(id) {
    const { data } = await this.instance.get(`/users/${id}`);

    return data;
  }

  async fetchTopQuestions({ period = 'week' }) {
    const { data } = await this.instance.get(`/questions?sort=like&status=open&period=${period}&size=20`);

    return {
      questions: data.questions,
    };
  }

  async fetchSearchResults({ keyword }) {
    const { data } = await this.instance.get(`/questions?sort=like&status=closed&keyword=${keyword}&size=20`);

    return {
      questions: data.questions,
    };
  }

  async fetchQuestions({ sort, keyword }) {
    const { data } = await this.instance.get(`/questions?status=open&sort=${sort}&keyword=${keyword}&size=20`);

    return {
      questions: data.questions,
    };
  }

  async fetchQuestionPreviews({ userId, sort }) {
    const { data } = await this.instance.get(`/question-previews?userId=${userId}&sort=${sort}`);

    return {
      questionPreviews: data.questionPreviews,
    };
  }

  async fetchScrappedQuestions() {
    const { data } = await this.instance.get('/scrapped-questions');

    return {
      questions: data.questions,
    };
  }

  async fetchQuestion(id) {
    const { data } = await this.instance.get(`/questions/${id}`);

    return data;
  }

  async toggleQuestionLike(id) {
    const { data } = await this.instance.patch(`/questions/${id}/likeUserIds`);

    return data.likeUserIds;
  }

  async fetchSolutions({ sort }) {
    const { data } = await this.instance.get(`/questions?status=closed&sort=${sort}&size=20`);

    return {
      solutions: data.questions,
    };
  }

  async fetchAnswers({ questionId }) {
    const { data } = await this.instance.get(`/answers?questionId=${questionId}`);

    return {
      answers: data.answers,
    };
  }

  async fetchAnswerPreviews({ userId, sort }) {
    const { data } = await this.instance.get(`/answer-previews?userId=${userId}&sort=${sort}`);

    return {
      answerPreviews: data.answerPreviews,
    };
  }

  async fetchAnswer(id) {
    const { data } = await this.instance.get(`/answers/${id}`);

    return data;
  }

  async toggleAnswerLike(id) {
    const { data } = await this.instance.patch(`/answers/${id}/likeUserIds`);

    return data.likeUserIds;
  }

  async createQuestion({
    title, body, tags, points,
  }) {
    const { data } = await this.instance.post('/questions', {
      title, body, tags: [...tags], points,
    });

    return {
      id: data.id,
    };
  }

  async modifyQuestion(question) {
    const { data } = await this.instance.put(`/questions/${question.id}`, {
      ...question, tags: [...question.tags],
    });

    return {
      id: data.id,
    };
  }

  async deleteQuestion(id) {
    await this.instance.delete(`/questions/${id}`);
  }

  async scrapQuestion(id) {
    const { data } = await this.instance.patch(`/questions/${id}/scrapUserIds`, {
      scrapped: true,
    });

    return {
      scrapUserIds: data.scrapUserIds,
    };
  }

  async cancelScrapQuestion(id) {
    const { data } = await this.instance.patch(`/questions/${id}/scrapUserIds`, {
      scrapped: false,
    });

    return {
      scrapUserIds: data.scrapUserIds,
    };
  }

  async createAnswer({
    questionId, body,
  }) {
    const { data } = await this.instance.post('/answers', {
      questionId, body,
    });

    return {
      id: data.id,
    };
  }

  async adoptAnswer({
    questionId,
    answerId,
  }) {
    await this.instance.patch(`/questions/${questionId}`, {
      answerId,
    });
  }

  async modifyAnswer({
    answerId,
    body,
  }) {
    await this.instance.patch(`/answers/${answerId}`, {
      body,
    });
  }

  async createAcknowledgement({
    questionId,
    answerId,
    points,
    message,
  }) {
    await this.instance.post('/acknowledgements', {
      questionId,
      answerId,
      message,
      points,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async upload(imageFile) {
    const url = `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload/`;

    const formData = new FormData();

    formData.append('api_key', cloudinaryKey);
    formData.append('upload_preset', 'ubvgz1nh');
    formData.append('timestamp', (Date.now() / 1000) || 0);
    formData.append('file', imageFile);

    const configOfUpload = {
      header: { 'Content-Type': 'multipart/form-data' },
    };
    const { data } = await axios.post(url, formData, configOfUpload);

    return data.url;
  }

  async charge(point) {
    const url = `${baseUrl}/charges`;

    const { data } = await this.instance.post(url, { quantity: point });

    return data;
  }

  async fetchPaymentResult(pgToken) {
    const url = `${baseUrl}/charges/kakaoPaySuccess`;

    const { data } = await this.instance.get(url, {
      params: {
        pg_token: pgToken,
      },
    });

    return data;
  }

  async requestExchange({ points, bank, accountNumber }) {
    const url = `${baseUrl}/exchanges`;

    const { data } = await this.instance.post(url, {
      quantity: points, bank, accountNumber,
    });

    return { id: data.id };
  }

  async validateAccount({ bank, accountNumber }) {
    const url = `${baseUrl}/account/verify`;

    const { data } = await this.instance.post(url, {
      bank, accountNumber,
    });

    return { validated: data.validated };
  }

  async fetchExchanges() {
    const { data } = await this.instance.get('/exchanges');

    return {
      exchanges: data.exchanges,
    };
  }
}

export const apiService = new ApiService();
