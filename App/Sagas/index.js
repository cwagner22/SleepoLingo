import { takeLatest } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { LessonTypes } from '../Redux/LessonRedux'
import { PlaybackTypes } from '../Redux/PlaybackRedux'
import { ImportTypes } from '../Redux/ImportRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login } from './LoginSagas'
import { getUserAvatar } from './GithubSagas'
import { downloadLesson, loadLesson, startAnki } from './LessonSagas'
import { playSaga, start, playerNext, playerPrev, playerStop, playerPause, playerResume, playerVolChange, playerSpeedChange } from './PlaybackSagas'
import { importStart } from './ImportSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(LoginTypes.LOGIN_REQUEST, login),

    takeLatest(LessonTypes.DOWNLOAD_LESSON, downloadLesson),
    takeLatest(LessonTypes.LOAD_LESSON, loadLesson),
    takeLatest(LessonTypes.LESSON_START_ANKI, startAnki),

    takeLatest(PlaybackTypes.PLAYBACK_START, playSaga),
    takeLatest(PlaybackTypes.PLAYER_START, start),
    takeLatest(PlaybackTypes.PLAYER_NEXT, playerNext),
    takeLatest(PlaybackTypes.PLAYER_PREV, playerPrev),
    takeLatest(PlaybackTypes.PLAYER_STOP, playerStop),
    takeLatest(PlaybackTypes.PLAYER_PAUSE, playerPause),
    takeLatest(PlaybackTypes.PLAYER_RESUME, playerResume),
    takeLatest(PlaybackTypes.PLAYBACK_VOL_CHANGE, playerVolChange),
    takeLatest(PlaybackTypes.PLAYBACK_SPEED_CHANGE, playerSpeedChange),

    takeLatest(ImportTypes.IMPORT_START, importStart),

    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api)
  ]
}
