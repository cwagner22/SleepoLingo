import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  lessonStart: ['lesson'],
  ankiHard: null,
  ankiShowBack: null,
  ankiShowFront: null,
  setCurrentWord: ['currentWord']
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lesson: null,
  isFront: true,
  currentWord: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const startLesson = (state, { lesson }: Object) => {
  return state.merge({ lesson })
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
  return state.setIn(['lesson', 'words', state.currentWord.id, 'showDate'], showDate)
}

export const showBack = (state) => {
  return state.merge({ isFront: false })
}

export const showFront = (state) => {
  return state.merge({ isFront: true })
}

export const setCurrentWord = (state, { currentWord }: Object) => {
  return state.merge({ currentWord })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LESSON_START]: startLesson,
  [Types.ANKI_HARD]: ankiHard,
  [Types.ANKI_SHOW_BACK]: showBack,
  [Types.ANKI_SHOW_FRONT]: showFront,
  [Types.SET_CURRENT_WORD]: setCurrentWord
})
