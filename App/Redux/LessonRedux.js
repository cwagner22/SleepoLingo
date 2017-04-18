import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import { normalize } from 'normalizr'
import moment from 'moment'

import { lessonsValuesSchema } from '../Redux/schema'
import lessons from '../Lessons'
import LessonHelper from '../Services/LessonHelper'
import WordHelper from '../Services/WordHelper'

export const LESSON_LOOP_MAX = 2

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadLessons: null,
  loadLesson: ['lessonId'],
  lessonStart: null,
  ankiHard: null,
  ankiOk: null,
  ankiEasy: null,
  lessonShowAnswer: null,
  lessonShowFront: null,
  lessonShowBack: null,
  loadNextCard: null,
  incCurrentWord: ['allowRestart'],
  decCurrentWord: null
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lessons: [],
  words: [],
  lessonGroups: [],
  currentLessonId: null,
  currentWordId: null,
  showAnswer: false,
  showFront: true,
  cardsDates: {},
  lessonLoopCounter: null,
  forcePlay: null
})

/* ------------- Reducers ------------- */

export const loadLessons = (state) => {
  const normalizedData = normalize(lessons, lessonsValuesSchema)
  return state.merge(normalizedData.entities)
}

export const loadLesson = (state, { lessonId }: Number) => {
  // Reset cards if new lesson
  var resetCards = {}
  if (lessonId !== state.currentLessonId) {
    resetCards = { cardsDates: {} }
  }
  return state.merge({
    ...resetCards,
    currentLessonId: lessonId
  })
}

export const startLesson = (state) => {
  return state.merge({
    showAnswer: false,
    currentWordId: null,
    lessonLoopCounter: 1
  })
}

const updateCardDate = (state, showDate) => {
  return state.setIn(['cardsDates', state.currentWordId], showDate.toDate())
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
  return state.merge({ showAnswer: true })
}

export const showFront = (state) => {
  return state.merge({ showFront: true })
}

export const showBack = (state) => {
  return state.merge({ showFront: false })
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
  const wordHelper = new WordHelper(state)

  // Assign dates for sorting
  var wordsWithDates = lessonHelper.currentWords().map((w) => {
    return wordHelper.wordWithDate(w)
  })

  var sortedWords = sortCards(wordHelper, wordsWithDates, false)
  var currentWordId = sortedWords.length ? sortedWords[0].id : null

  return state.merge({
    showAnswer: false,
    showFront: true,
    currentWordId
  })
}

const navigateCurrentWord = (state, action) => {
  const lessonHelper = new LessonHelper(state)
  var currentWords = lessonHelper.currentWords()
  var lessonLoopCounter = state.lessonLoopCounter
  var index = currentWords.findIndex((w) => w.id === state.currentWordId)
  var currentWordId

  switch (action.type) {
    case 'INC_CURRENT_WORD':
      if (++index >= currentWords.length) {
        // if (allowRestart) {
        // if (state.lessonLoopCounter < LESSON_LOOP_MAX) {
        lessonLoopCounter++
        index = 0
        // } else {
        //   index = currentWords.length - 1
        // }
        // } else {
        //
        // }
      }

      currentWordId = currentWords[Math.max(0, index)].id
      return {
        ...state,
        lessonLoopCounter,
        currentWordId,
        sameWord: currentWordId === state.currentWordId
      }
    case 'DEC_CURRENT_WORD':
      currentWordId = currentWords[Math.max(0, --index)].id
      return {
        ...state,
        lessonLoopCounter,
        currentWordId,
        sameWord: currentWordId === state.currentWordId
      }
    default:
      return state
  }
}

export const incCurrentWord = (state, action) => {
  return navigateCurrentWord(state, action)
}

export const decCurrentWord = (state, action) => {
  return navigateCurrentWord(state, action)
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
  [Types.INC_CURRENT_WORD]: incCurrentWord,
  [Types.DEC_CURRENT_WORD]: decCurrentWord
})
