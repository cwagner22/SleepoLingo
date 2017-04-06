import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  lessonStart: ['lesson'],
  ankiHard: null,
  lessonShowAnswer: null,
  loadNextCard: null
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lesson: null,
  showAnswer: false,
  currentWord: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const startLesson = (state, { lesson }: Object) => {
  if (lesson.id !== state.lesson.id) {
    return state.merge({ lesson })
  } else {
    // Keep same lesson state
    return state.merge({
      showAnswer: false,
      currentWord: null
    })
  }
}

export const ankiHard = (state) => {
  var currentTime = new Date()
  var showDate = currentTime.setTime(currentTime.getTime() + 1000 * 60)
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

  return state.setIn(['lesson', 'words', state.currentWord.id, 'showDate'], showDate)
}

export const showAnswer = (state) => {
  return state.merge({ showAnswer: true })
}

export const loadNextCard = (state) => {
  var sortedWords = _.sortBy(state.lesson.words, ['showDate', 'id'])
    .filter((word) => {
      // Exclude future cards
      return !word.showDate || word.showDate < new Date()
    })
  return state.merge({ showAnswer: false, currentWord: sortedWords[0] })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LESSON_START]: startLesson,
  [Types.ANKI_HARD]: ankiHard,
  [Types.LESSON_SHOW_ANSWER]: showAnswer,
  [Types.LOAD_NEXT_CARD]: loadNextCard
})
