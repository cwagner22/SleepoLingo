import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  playbackVolChange: ["volume"],
  playbackSpeedChange: null,
  playbackSetPaused: ["isPaused"],
  playbackInit: null,
  playbackStart: ["sentence", "language", "volume", "speed"],
  playbackSuccess: null,
  playbackError: null,
  playerStop: null,
  playerPause: null,
  playerResume: null,
  playerStart: null,
  startNight: null,
  playerNext: null,
  playerPrev: null,
  playerReady: null,
  setPlayingState: ["playingState"],
  setLessonLoopCounter: ["lessonLoopCounter"],
  playbackSetDuration: ["duration"],
  playbackSetElapsedTime: ["elapsedTime"],
  playbackLoopMaxChange: ["lessonLoopMax"],
  playbackSetControlOS: ["controlOS"],
  playbackSetCardsCount: ["cardsCount"]
});

export const PlaybackTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  volume: 1,
  speed: 1,
  isPaused: true,
  playing: false,
  playingState: null,
  lessonLoopCounter: null,
  lessonLoopMax: 4,
  elapsedTime: null,
  duration: null,
  controlOS: false,
  cardsCount: null
});

/* ------------- Reducers ------------- */

export const playerStart = (state, { volume }) => {
  return state.merge({
    lessonLoopCounter: 0,
    playingState: null,
    elapsedTime: 0,
    duration: 0,
    playerRunning: true
  });
};

export const playerStop = (state, { volume }) => {
  return state.merge({
    playerRunning: false
  });
};

export const changeVolume = (state, { volume }) => {
  return state.merge({ volume });
};

export const changeSpeed = state => {
  let speed = state.speed + 0.25;
  speed = speed <= 2 ? speed : 0.5;
  return state.merge({ speed });
};

export const setResults = (state, { results }) => {
  return state.merge({ results });
};

export const setPaused = (state, { isPaused }) => {
  return state.merge({ isPaused });
};

export const success = state => {
  return state.merge({ playing: false });
};

export const error = state => {
  return state.merge({ playing: false, error: true });
};

export const start = (state, { language }) => {
  return state.merge({
    playing: true
  });
};

export const setPlayingState = (state, { playingState }) => {
  return state.merge({ playingState });
};

export const setLessonLoopCounter = (state, { lessonLoopCounter }) => {
  return state.merge({ lessonLoopCounter });
};

export const setDuration = (state, { duration }) => {
  return state.merge({ duration });
};

export const setElapsedTime = (state, { elapsedTime }) => {
  return state.merge({ elapsedTime });
};

export const playbackLoopMaxChange = (state, { lessonLoopMax }) => {
  return state.merge({ lessonLoopMax });
};

export const setControlOS = (state, { controlOS }) => {
  return state.merge({ controlOS });
};

export const setCardsCount = (state, { cardsCount }) => {
  return state.merge({ cardsCount });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PLAYBACK_VOL_CHANGE]: changeVolume,
  [Types.PLAYBACK_SPEED_CHANGE]: changeSpeed,
  [Types.PLAYBACK_SET_PAUSED]: setPaused,
  [Types.PLAYER_START]: playerStart,
  [Types.PLAYER_STOP]: playerStop,
  [Types.PLAYBACK_SUCCESS]: success,
  [Types.PLAYBACK_ERROR]: error,
  [Types.PLAYBACK_START]: start,
  [Types.SET_PLAYING_STATE]: setPlayingState,
  [Types.SET_LESSON_LOOP_COUNTER]: setLessonLoopCounter,
  [Types.PLAYBACK_SET_ELAPSED_TIME]: setElapsedTime,
  [Types.PLAYBACK_SET_DURATION]: setDuration,
  [Types.PLAYBACK_LOOP_MAX_CHANGE]: playbackLoopMaxChange,
  [Types.PLAYBACK_SET_CONTROL_OS]: setControlOS,
  [Types.PLAYBACK_SET_CARDS_COUNT]: setCardsCount
});
