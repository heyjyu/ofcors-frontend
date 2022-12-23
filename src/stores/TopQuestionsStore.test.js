import TopQuestionsStore from './TopQuestionsStore';

describe('TopQuestionsStore', () => {
  let topQuestionsStore;

  beforeEach(() => {
    topQuestionsStore = new TopQuestionsStore();
  });

  describe('fetchQuestions', () => {
    it('loads questions', async () => {
      await topQuestionsStore.fetchQuestions({ period: 'week' });

      expect(topQuestionsStore.fields.questions).toHaveLength(2);
    });
  });
});