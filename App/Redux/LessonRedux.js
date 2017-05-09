import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  lessonStart: null,
  ankiHard: null,
  ankiOk: null,
  ankiEasy: null,
  lessonShowAnswer: null,
  lessonShowFront: null,
  lessonShowBack: null,
  loadNextCard: null,
  nextCardLoaded: ['card'],
  downloadLesson: ['currentCards'],
  loadLesson: ['lesson'],
  setCurrentLesson: ['lesson'],
  setCurrentCard: ['currentCard']
})

export const LessonTypes = Types
export default Creators

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
  cardsDates: {},
  lessonLoopCounter: null,
  forcePlay: null,
  translationLoopCounter: null
})

/* ------------- Reducers ------------- */

export const setCurrentLesson = (state, {lesson}) => {
  return state.merge({
    // currentLesson: lesson
    currentLessonId: lesson.id
  })
  // return Object.assign(state.currentLesson, lesson);
}

export const startLesson = (state) => {
  return state.merge({
    showAnswer: false,
    // currentCard: null,
    currentCardId: null,
    lessonLoopCounter: 0,
    translationLoopCounter: 0,
    playingState: null
  })
}

export const showAnswer = (state) => {
  return state.merge({showAnswer: true})
}

export const showFront = (state) => {
  return state.merge({showFront: true})
}

export const showBack = (state) => {
  return state.merge({showFront: false})
}

export const nextCardLoaded = (state, {card}) => {
  return state.merge({
    showAnswer: false,
    showFront: true,
    // currentCard: card
    currentCardId: card.id
  })
}

export const setCurrentCard = (state, {currentCard}) => {
  return state.merge({
    currentCard
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LESSON_START]: startLesson,
  [Types.LESSON_SHOW_ANSWER]: showAnswer,
  [Types.LESSON_SHOW_FRONT]: showFront,
  [Types.LESSON_SHOW_BACK]: showBack,
  [Types.NEXT_CARD_LOADED]: nextCardLoaded,
  [Types.SET_CURRENT_LESSON]: setCurrentLesson,
  [Types.SET_CURRENT_CARD]: setCurrentCard
})
