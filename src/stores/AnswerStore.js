import { apiService } from '../services/ApiService';

import Store from './Store';

export default class AnswerStore extends Store {
  constructor() {
    super();

    this.reset();
  }

  async fetchAnswers({ questionId }) {
    this.startAnswersLoad();

    try {
      const { answers } = await apiService.fetchAnswers({ questionId });

      this.completeAnswersLoad(answers);
    } catch (e) {
      this.failAnswersLoad();
    }
  }

  async fetchAnswer(id) {
    this.startAnswerLoad();

    try {
      const answer = await apiService.fetchAnswer(id);

      this.completeAnswerLoad(answer);
    } catch (e) {
      this.failAnswerLoad();
    }
  }

  async toggleLike(id) {
    const likeUserIds = await apiService.toggleAnswerLike(id);

    this.answers = this.answers.map((answer) => {
      if (answer.id === id) {
        return { ...answer, likeUserIds };
      }

      return answer;
    });

    this.publish();
  }

  async write({
    questionId, body,
  }) {
    this.startWrite();

    try {
      const { id } = await apiService.createAnswer({
        questionId, body,
      });

      const answer = await apiService.fetchAnswer(id);

      this.answers = [...this.answers, answer];

      this.completeWrite();
    } catch (e) {
      this.failWrite();
    }
  }

  startAnswersLoad() {
    this.isAnswersLoading = true;
    this.answers = [];
    this.publish();
  }

  completeAnswersLoad(answers) {
    this.isAnswersLoading = false;
    this.answers = answers;
    this.publish();
  }

  failAnswersLoad() {
    this.isAnswersLoading = false;
    this.answers = [];
    this.publish();
  }

  startAnswerLoad() {
    this.isAnswerLoading = true;
    this.answer = null;
    this.publish();
  }

  completeAnswerLoad(answer) {
    this.isAnswerLoading = false;
    this.answer = answer;
    this.publish();
  }

  failAnswerLoad() {
    this.isAnswerLoading = false;
    this.answer = null;
    this.publish();
  }

  startWrite() {
    this.writeStatus = 'processing';
    this.publish();
  }

  completeWrite() {
    this.writeStatus = 'successful';
    this.publish();
  }

  failWrite() {
    this.writeStatus = 'failed';
    this.publish();
  }

  reset() {
    this.isAnswersLoading = false;
    this.isAnswerLoading = false;
    this.answers = [];
    this.answer = null;
    this.writeStatus = '';
  }

  get isWriteSuccessful() {
    return this.writeStatus === 'successful';
  }

  get isWriteFailed() {
    return this.writeStatus === 'failed';
  }
}

export const answerStore = new AnswerStore();