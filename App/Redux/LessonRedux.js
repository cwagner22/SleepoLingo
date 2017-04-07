import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import { normalize, schema } from 'normalizr'
import moment from 'moment'
// import { orderSchema } from './schemas';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  lessonStart: ['lesson'],
  ankiHard: null,
  ankiOk: null,
  ankiEasy: null,
  lessonShowAnswer: null,
  loadNextCard: null
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lesson: {},
  showAnswer: false,
  currentWord: {},
  cardsDates: [], // Separate array to keep track of cards dates. Including it in lesson words would make it
  // overwritten on lesson load
  words: []
})

/* ------------- Schemas ------------- */

const wordSchema = new schema.Entity('words')

const lessonSchema = new schema.Entity('lesson', {
  words: [ wordSchema ]
})

/* ------------- Reducers ------------- */

export const startLesson = (state, { lesson }: Object) => {
  // Normalize
  const normalizedData = normalize(lesson, lessonSchema)

  // Reset cards if new lesson
  var resetCards = {}
  if (lesson.id !== state.lesson.id) {
    resetCards = { cardsDates: [] }
  } else {
    // Assign dates
    _.each(normalizedData.entities.words, (w) => {
      w.showDate = state.cardsDates[w.id]
    })
  }

  return state.merge({
    ...resetCards,
    ...normalizedData.entities,
    lesson: normalizedData.entities.lesson[0],
    // cardsDates: [],
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

export const loadNextCard = (state) => {
  // Sort words
  var sortedWords = _.sortBy(state.words, ['showDate', 'id'])
    .filter((word) => {
      // Exclude future cards
      return !word.showDate || word.showDate < new Date()
    })
  console.log(sortedWords)
  return state.merge({ showAnswer: false, currentWord: sortedWords[0] })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LESSON_START]: startLesson,
  [Types.ANKI_HARD]: ankiHard,
  [Types.ANKI_OK]: ankiOk,
  [Types.ANKI_EASY]: ankiEasy,
  [Types.LESSON_SHOW_ANSWER]: showAnswer,
  [Types.LOAD_NEXT_CARD]: loadNextCard
})
