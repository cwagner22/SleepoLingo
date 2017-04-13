import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  playbackVolChange: ['volume'],
  playbackSetPaused: ['isPaused'],
  playbackInit: null
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  volume: 1,
  isPaused: true
})

/* ------------- Reducers ------------- */

export const init = (state, { volume }: Object) => {
  return state.merge({ lessonLoopIndex: 0 })
}

export const changeVolume = (state, { volume }: Object) => {
  return state.merge({ volume })
}

export const setResults = (state, { results }: Object) => {
  return state.merge({ results })
}

export const setPaused = (state, { isPaused }: Object) => {
  return state.merge({ isPaused })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PLAYBACK_VOL_CHANGE]: changeVolume,
  [Types.PLAYBACK_SET_PAUSED]: setPaused,
  [Types.PLAYBACK_INIT]: init
})
