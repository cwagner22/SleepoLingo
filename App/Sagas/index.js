import { takeLatest, all } from "redux-saga/effects";
import API from "../Services/Api";
import FixtureAPI from "../Services/FixtureApi";
import DebugConfig from "../Config/DebugConfig";

/* ------------- Types ------------- */

import { LessonTypes } from "../Redux/LessonRedux";
import { PlaybackTypes } from "../Redux/PlaybackRedux";
import { ImportTypes } from "../Redux/ImportRedux";

/* ------------- Sagas ------------- */

import {
  downloadLesson,
  loadLesson,
  startAnki,
  loadNextCard,
  ankiDifficulty
} from "./LessonSagas";
import {
  playSaga,
  start,
  startNight,
  playerNext,
  playerPrev,
  playerStop,
  playerPause,
  playerResume,
  playerVolChange,
  playerSpeedChange,
  playbackLoopMaxChange
} from "./PlaybackSagas";
import { startImport } from "./ImportSagas";

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    takeLatest(LessonTypes.DOWNLOAD_LESSON, downloadLesson),
    takeLatest(LessonTypes.LOAD_LESSON, loadLesson),
    takeLatest(LessonTypes.START_ANKI, startAnki),
    takeLatest(LessonTypes.LOAD_NEXT_CARD, loadNextCard),
    takeLatest(LessonTypes.ANKI_DIFFICULTY, ankiDifficulty),

    takeLatest(PlaybackTypes.PLAYBACK_START, playSaga),
    takeLatest(PlaybackTypes.PLAYER_START, start),
    takeLatest(PlaybackTypes.START_NIGHT, startNight),
    takeLatest(PlaybackTypes.PLAYER_NEXT, playerNext),
    takeLatest(PlaybackTypes.PLAYER_PREV, playerPrev),
    takeLatest(PlaybackTypes.PLAYER_STOP, playerStop),
    takeLatest(PlaybackTypes.PLAYER_PAUSE, playerPause),
    takeLatest(PlaybackTypes.PLAYER_RESUME, playerResume),
    takeLatest(PlaybackTypes.PLAYBACK_VOL_CHANGE, playerVolChange),
    takeLatest(PlaybackTypes.PLAYBACK_SPEED_CHANGE, playerSpeedChange),
    takeLatest(PlaybackTypes.PLAYBACK_LOOP_MAX_CHANGE, playbackLoopMaxChange),

    takeLatest(ImportTypes.START_IMPORT, startImport)
  ]);
}
