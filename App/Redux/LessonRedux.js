import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import { normalize } from 'normalizr'
import moment from 'moment'

import { lessonsValuesSchema } from '../Redux/schema'
import lessons from '../Lessons'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  lessonStart: ['lesson'],
  loadLessons: null,
  ankiHard: null,
  ankiOk: null,
  ankiEasy: null,
  lessonShowAnswer: null,
  lessonShowFront: null,
  lessonShowBack: null,
  loadNextCard: null
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lesson: [],
  words: [],
  lessonGroup: [],
  currentLesson: {},
  currentWord: {},
  showAnswer: false,
  showFront: true,
  cardsDates: []
})

/* ------------- Reducers ------------- */

export const startLesson = (state, { lesson }: Object) => {
  // Reset cards if new lesson
  var resetCards = {}
  if (lesson.id !== state.lesson.id) {
    resetCards = { cardsDates: [] }
  }

  return state.merge({
    ...resetCards,
    currentLesson: lesson,
    showAnswer: false,
    currentWord: null
  })
}

const updateCardDate = (state, showDate) => {
  // return state.merge({
  //   currentWord: {
  //     ...state.currentWord,
  //     showDate: showDate
  //   },
  //   lesson: {
  //     ...state.lesson,
  //     words : {
  //       ...state.lesson.words,
  //       [state.currentWord.id] : {
  //         ...state.lesson.words[state.currentWord.id],
  //         showDate: showDate
  //       }
  //     }
  //   }
  // })

  // return state.merge({currentWord: {showDate}}, {deep: true})

  // return state.lesson.words.map(w => () => {
  //   if (w.id !== state.currentWord.id) {
  //     return w;
  //   }
  //   return {
  //     ...w,
  //     showDate
  //   };
  // });

  return state.setIn(['cardsDates', state.currentWord.id], showDate.toDate())
    .setIn(['words', state.currentWord.id, 'showDate'], showDate.toDate())
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

export const loadNextCard = (state) => {
  // Assign dates for sorting
  var wordsWithDates = state.words.map((w) => {
    return {
      ...w,
      showDate: state.cardDates[w.id]
    }
  })

  // Sort words
  var sortedWords = _.sortBy(wordsWithDates, ['showDate', 'id'])
    .filter((word) => {
      // Exclude future cards
      return !word.showDate || word.showDate < new Date()
      // return !word.showDate || word.showDate.isBefore(moment())
    })
  console.log(sortedWords)

  return state.merge({
    showAnswer: false,
    showFront: true,
    currentWord: sortedWords[0]
  })
}

export const loadLessons = (state) => {
  const normalizedData = normalize(lessons, lessonsValuesSchema)
  return state.merge(normalizedData.entities)
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
  [Types.LOAD_LESSONS]: loadLessons
})
