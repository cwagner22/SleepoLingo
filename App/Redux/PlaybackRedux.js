import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  playbackVolChange: ['volume'],
  playbackSpeedChange: null,
  playbackSetPaused: ['isPaused'],
  playbackInit: null,
  playbackStart: ['sentence', 'language', 'volume', 'speed'],
  playbackSuccess: null,
  playbackError: null,
  playerStop: null,
  playerStart: null,
  playerNext: null,
  playerPrev: null,
  playerReady: null,
  setPlayingState: ['playingState']
})

export const PlaybackTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  volume: 1,
  speed: 1,
  isPaused: true,
  playing: false,
  playingState: null
})

/* ------------- Reducers ------------- */

export const init = (state, { volume }: Object) => {
  return state.merge({
    lessonLoopIndex: 0,
    playingState: null
  })
}

export const changeVolume = (state, { volume }: Object) => {
  return state.merge({ volume })
}

export const changeSpeed = (state) => {
  let speed = state.speed + 0.25
  speed = speed <= 2 ? speed : 0.25
  return state.merge({ speed })
}

export const setResults = (state, { results }: Object) => {
  return state.merge({ results })
}

export const setPaused = (state, { isPaused }: Object) => {
  return state.merge({ isPaused })
}

export const success = (state) => {
  return state.merge({ playing: false })
}

export const error = (state) => {
  return state.merge({ playing: false, error: true })
}

export const start = (state, { language }) => {
  return state.merge({ playing: true })
}

export const setPlayingState = (state, { playingState }) => {
  return state.merge({ playingState })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PLAYBACK_VOL_CHANGE]: changeVolume,
  [Types.PLAYBACK_SPEED_CHANGE]: changeSpeed,
  [Types.PLAYBACK_SET_PAUSED]: setPaused,
  [Types.PLAYBACK_INIT]: init,
  [Types.PLAYBACK_SUCCESS]: success,
  [Types.PLAYBACK_ERROR]: error,
  [Types.PLAYBACK_START]: start,
  [Types.SET_PLAYING_STATE]: setPlayingState
})
