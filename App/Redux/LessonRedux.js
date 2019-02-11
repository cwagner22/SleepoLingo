import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import moment from "moment";
import _ from "lodash";
import { NavigationActions } from "react-navigation";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startAnki: null,
  startLesson: null,
  ankiHard: null,
  ankiOk: null,
  ankiEasy: null,
  lessonShowAnswer: null,
  lessonShowFront: null,
  lessonShowBack: null,
  loadNextCard: null,
  nextCardLoaded: ["card"],
  downloadLesson: ["currentCards"],
  loadLesson: ["lesson"],
  setCurrentLesson: ["lessonId"],
  setCurrentCard: ["currentCardId"],
  resetDates: null,
  lessonUpdateCompleted: ["isCompleted"]
});

export const LessonTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lessons: [],
  cards: [],
  lessonGroups: [],
  // currentLesson: null,
  currentLessonId: null,
  // currentCard: null,
  currentCardId: null,
  showAnswer: false,
  showFront: true,
  showDates: {},
  completedLessons: {},
  lessonLoopCounter: null,
  forcePlay: null,
  translationLoopCounter: null
});

/* ------------- Reducers ------------- */

export const setCurrentLesson = (state, { lessonId }) => {
  return state.merge({
    currentLessonId: lessonId
  });
};

export const startLesson = state => {
  return state.merge({
    showAnswer: false,
    // currentCard: null,
    currentCardId: null,
    lessonLoopCounter: 0,
    translationLoopCounter: 0,
    playingState: null
  });
};

export const showAnswer = state => {
  return state.merge({ showAnswer: true });
};

export const showFront = state => {
  9;
  return state.merge({ showFront: true });
};

export const showBack = state => {
  return state.merge({ showFront: false });
};

export const setCurrentCard = (state, { currentCardId }) => {
  return state.merge({
    currentCardId
  });
};

export const resetDates = state => {
  return state.merge({
    showDates: {}
  });
};

// function sortCards(cards, allowAlmost = false) {
//   var sortedCardsReady = cards
//     .sort(c => c.index)
//     .filter(card => {
//       // Exclude future cards
//       return card.isReady(allowAlmost);
//     });

//   if (!sortedCardsReady.length && !allowAlmost) {
//     return sortCards(cards, true);
//   } else {
//     return sortedCardsReady;
//   }
// }

export const loadNextCard = state => {
  // const currentLesson = Lesson.getFromId(state.currentLessonId, true);
  // const sortedCards = sortCards(currentLesson.cards, false);
  // console.log(sortedCards);
  // const currentCardId = sortedCards.length ? sortedCards[0].id : null;

  // let newState = state;
  // if (!currentCardId) {
  //   newState = lessonUpdateCompleted(state, { isCompleted: true });
  // }

  return state.merge({
    showAnswer: false,
    showFront: true
    // currentCardId,
    // currentCard: null
  });
};

const updateCardDate = (state, showDate) => {
  return state.setIn(["showDates", state.currentCardId], showDate.toDate());
};

const lessonUpdateCompleted = (state, { isCompleted }) => {
  return state.setIn(["completedLessons", state.currentLessonId], isCompleted);
};

export const ankiHard = state => {
  return updateCardDate(state, moment().add(1, "m"));
};

export const ankiOk = state => {
  return updateCardDate(state, moment().add(10, "m"));
};

export const ankiEasy = state => {
  return updateCardDate(state, moment().add(2, "d"));
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.START_LESSON]: startLesson,
  [Types.LESSON_SHOW_ANSWER]: showAnswer,
  [Types.LESSON_SHOW_FRONT]: showFront,
  [Types.LESSON_SHOW_BACK]: showBack,
  // [Types.NEXT_CARD_LOADED]: nextCardLoaded,
  [Types.SET_CURRENT_LESSON]: setCurrentLesson,
  [Types.SET_CURRENT_CARD]: setCurrentCard,
  [Types.RESET_DATES]: resetDates,
  // [Types.SET_DATE]: setDate
  [Types.LOAD_NEXT_CARD]: loadNextCard,
  // [Types.LOAD_NEXT_CARDS]: loadNextCards,
  // [Types.ANKI_HARD]: ankiHard,
  [Types.ANKI_OK]: ankiOk,
  [Types.ANKI_EASY]: ankiEasy,
  [Types.LESSON_UPDATE_COMPLETED]: lessonUpdateCompleted
});
