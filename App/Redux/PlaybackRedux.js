import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  playbackVolChange: ['volume'],
  playbackResults: ['results'],
  incLessonLoop: ['lessonLoopIndex'],
  decLessonLoop: ['lessonLoopIndex'],
  setLessonLoop: ['lessonLoopIndex'],
  setCurrentWord: ['currentWordIndex'],
  incCurrentWord: ['currentWordIndex'],
  decCurrentWord: ['currentWordIndex'],
  playbackSetPaused: ['isPaused'],
  lessonStart: ['lesson']
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  volume: 1,
  lesson: null,
  lessonLoopIndex: -1,
  currentWordIndex: -1,
  isPaused: true
})

/* ------------- Reducers ------------- */

export const changeVolume = (state, { volume }: Object) => {
  return state.merge({ volume })
}

export const setResults = (state, { results }: Object) => {
  return state.merge({ results })
}

export const incLessonLoop = (state) => {
  return state.merge({ lessonLoopIndex: state.lessonLoopIndex + 1 })
}

export const decLessonLoop = (state) => {
  return state.merge({ lessonLoopIndex: state.lessonLoopIndex - 1 })
}

export const setLessonLoop = (state, { lessonLoopIndex }: Object) => {
  return state.merge({ lessonLoopIndex })
}

export const incCurrentWord = (state) => {
  return state.merge({ currentWordIndex: Math.min(state.lesson.words.length - 1, state.currentWordIndex + 1) })
}

export const decCurrentWord = (state) => {
  return state.merge({ currentWordIndex: Math.max(0, state.currentWordIndex - 1) })
}

export const setCurrentWord = (state, { currentWordIndex }: Object) => {
  return state.merge({ currentWordIndex })
}

export const setPaused = (state, { isPaused }: Object) => {
  return state.merge({ isPaused })
}

export const startLesson = (state, { lesson }: Object) => {
  return state.merge({ lesson })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PLAYBACK_VOL_CHANGE]: changeVolume,
  [Types.PLAYBACK_RESULTS]: setResults,
  [Types.INC_LESSON_LOOP]: incLessonLoop,
  [Types.DEC_LESSON_LOOP]: decLessonLoop,
  [Types.SET_LESSON_LOOP]: setLessonLoop,
  [Types.SET_CURRENT_WORD]: setCurrentWord,
  [Types.INC_CURRENT_WORD]: incCurrentWord,
  [Types.DEC_CURRENT_WORD]: decCurrentWord,
  [Types.PLAYBACK_SET_PAUSED]: setPaused,
  [Types.LESSON_START]: startLesson
})
