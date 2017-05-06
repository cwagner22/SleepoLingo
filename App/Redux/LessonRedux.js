import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import moment from 'moment'

import {sortCards} from '../Realm/realm'

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
  downloadLesson: ['currentCards'],
  loadLesson: ['lesson'],
  setCurrentLesson: ['lesson'],
  setCurrentCard: ['currentCardId']
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lessons: [],
  cards: [],
  lessonGroups: [],
  // currentLessonId: null,
  currentLesson: null,
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
    currentLesson: lesson
  })
}

export const startLesson = (state) => {
  return state.merge({
    showAnswer: false,
    currentCardId: null,
    lessonLoopCounter: 0,
    translationLoopCounter: 0,
    playingState: null
  })
}

const updateCardDate = (state, showDate) => {
  return state.setIn(['cardsDates', state.currentCardId], showDate.toDate())
}

export const ankiHard = (state) => {
  return updateCardDate(state, moment().add(1, 'm'))
}

export const ankiOk = (state) => {
  return updateCardDate(state, moment().add(10, 'm'))
}

export const ankiEasy = (state) => {
  return updateCardDate(state, moment().add(1, 'd'))
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

export const loadNextCard = (state) => {
  // const currentLesson = yield select(getCurrentLesson)
  // const cards = yield call(sortCards, currentLesson.cards)
  const cards = sortCards(state.currentLesson.cards)
  var currentCard = cards.length ? cards[0] : null

  return state.merge({
    showAnswer: false,
    showFront: true,
    currentCard
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
  [Types.ANKI_HARD]: ankiHard,
  [Types.ANKI_OK]: ankiOk,
  [Types.ANKI_EASY]: ankiEasy,
  [Types.LESSON_SHOW_ANSWER]: showAnswer,
  [Types.LESSON_SHOW_FRONT]: showFront,
  [Types.LESSON_SHOW_BACK]: showBack,
  [Types.LOAD_NEXT_CARD]: loadNextCard,
  // [Types.LOAD_LESSON]: loadLesson,
  [Types.SET_CURRENT_LESSON]: setCurrentLesson,
  [Types.SET_CURRENT_CARD]: setCurrentCard
})
