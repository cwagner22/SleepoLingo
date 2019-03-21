import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startAnki: null,
  startLesson: null,
  ankiDifficulty: ["difficulty"],
  lessonShowAnswer: null,
  lessonShowFront: null,
  lessonShowBack: null,
  loadNextCard: null,
  nextCardLoaded: ["card"],
  downloadLesson: ["cards"],
  loadLesson: ["lesson"],
  setCurrentLesson: ["lessonId"],
  setCurrentCard: ["currentCardId"],
  setLessonProgress: ["lessonId"]
});

export const LessonTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  currentLessonId: null,
  currentCardId: null,
  lessonLoopCounter: null,
  forcePlay: null,
  translationLoopCounter: null
});

/* ------------- Selectors ------------- */

export const LessonSelectors = {
  // selectAvatar: state => state.lesson.avatar
};

/* ------------- Reducers ------------- */

export const setCurrentLesson = (state, { lessonId }) => {
  return state.merge({
    currentLessonId: lessonId
  });
};

export const startLesson = state => {
  return state.merge({
    currentCardId: null,
    lessonLoopCounter: 0,
    translationLoopCounter: 0,
    playingState: null
  });
};

export const showAnswer = state => {
  return state.merge({ showAnswer: true });
};

export const setCurrentCard = (state, { currentCardId }) => {
  return state.merge({
    currentCardId,
    showAnswer: false
  });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.START_LESSON]: startLesson,
  [Types.LESSON_SHOW_ANSWER]: showAnswer,
  [Types.SET_CURRENT_LESSON]: setCurrentLesson,
  [Types.SET_CURRENT_CARD]: setCurrentCard
});
