import { apiService } from '../services/ApiService';

import Store from './Store';

export default class TopQuestionStore extends Store {
  constructor() {
    super();

    this.isQuestionsLoaded = false;
    this.questions = [];
  }

  async fetchQuestions({ period }) {
    this.isQuestionsLoaded = false;

    this.publish();

    const { questions } = await apiService.fetchTopQuestions({ period });

    this.questions = questions;

    this.isQuestionsLoaded = true;

    this.publish();
  }
}

export const topQuestionStore = new TopQuestionStore();