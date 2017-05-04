import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import { normalize } from 'normalizr'
import moment from 'moment'

import { lessonsValuesSchema } from '../Redux/schema'
import lessons from '../Lessons'
import LessonHelper from '../Services/LessonHelper'
import CardHelper from '../Services/CardHelper'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  loadLessons: null,
  lessonStart: null,
  ankiHard: null,
  ankiOk: null,
  ankiEasy: null,
  lessonShowAnswer: null,
  lessonShowFront: null,
  lessonShowBack: null,
  downloadLesson: ['currentCards'],
  loadLesson: ['lessonId'],
  setCurrentCard: ['currentCardId']
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lessons: [],
  cards: [],
  lessonGroups: [],
  currentLessonId: null,
  currentCardId: null,
  showAnswer: false,
  showFront: true,
  cardsDates: {},
  lessonLoopCounter: null,
  forcePlay: null,
  translationLoopCounter: null
})

/* ------------- Reducers ------------- */

export const loadLessons = (state) => {
  const normalizedData = normalize(lessons, lessonsValuesSchema)
  return state.merge(normalizedData.entities)
}

export const loadLesson = (state, {lessonId}: Number) => {
  // Reset cards if new lesson
  var resetCards = {}
  if (lessonId !== state.currentLessonId) {
    resetCards = {cardsDates: {}}
  }
  return state.merge({
    ...resetCards,
    currentLessonId: lessonId
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

const sortCards = (wordHelper, wordsWithDates, allowAlmost) => {
  // Sort by date and index
  var sortedWords = _.sortBy(wordsWithDates, ['showDate', (w, i) => i])
    .filter((word) => {
      // Exclude future cards
      return wordHelper.isReady(word, allowAlmost)
    })

  if (sortedWords.length) {
    return sortedWords
  } else {
    return sortCards(wordHelper, wordsWithDates, true)
  }
}

export const loadNextCard = (state) => {
  const lessonHelper = new LessonHelper(state)
  const cardHelper = new CardHelper(state)

  // Assign dates for sorting
  var cardsWithDates = lessonHelper.currentCards().map((c) => {
    return cardHelper.cardWithDate(c)
  })

  var sortedCards = sortCards(cardHelper, cardsWithDates, false)
  var currentCardId = sortedCards.length ? sortedCards[0].id : null

  return state.merge({
    showAnswer: false,
    showFront: true,
    currentCardId
  })
}

export const setCurrentCard = (state, { currentCardId }) => {
  return state.merge({
    currentCardId
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
  [Types.LOAD_LESSONS]: loadLessons,
  [Types.LOAD_LESSON]: loadLesson,
  [Types.SET_CURRENT_CARD]: setCurrentCard
})
