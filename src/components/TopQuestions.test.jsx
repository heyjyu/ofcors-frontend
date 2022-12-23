import {
  render, screen,
} from '@testing-library/react';
import { topQuestionStore } from '../stores/TopQuestionStore';
import TopQuestions from './TopQuestions';

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line react/prop-types
  Link({ children, to }) {
    return (
      <a href={to}>
        {children}
      </a>
    );
  },
}));

const context = describe;

describe('TopQuestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderTopQuestions() {
    render((
      <TopQuestions />
    ));
  }

  context('without question', () => {
    it('renders "질문을 등록해주세요!" message', () => {
      topQuestionStore.isQuestionsLoaded = true;
      topQuestionStore.questions = [];
      renderTopQuestions();

      screen.getByText('질문을 등록해주세요!');
    });
  });

  context('with questions', () => {
    it('renders question title', async () => {
      await topQuestionStore.fetchQuestions({ period: 'week' });
      renderTopQuestions();

      screen.getByText(/Access-Control-Allow-Origin/);
    });
  });
});
