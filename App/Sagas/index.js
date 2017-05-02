import { takeLatest } from 'redux-saga'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { TemperatureTypes } from '../Redux/TemperatureRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { OpenScreenTypes } from '../Redux/OpenScreenRedux'
import { LessonTypes } from '../Redux/LessonRedux'
import { PlaybackTypes } from '../Redux/PlaybackRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login } from './LoginSagas'
import { getTemperature } from './TemperatureSagas'
import { openScreen } from './OpenScreenSagas'
import { downloadLesson, loadLesson } from './LessonSagas'
import { play } from './PlaybackSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugSettings.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

// Example: https://github.com/andresmijares/async-redux-saga/blob/master/src/sagas/
export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(LoginTypes.LOGIN_REQUEST, login),
    takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),

    takeLatest(LessonTypes.DOWNLOAD_LESSON, downloadLesson),
    takeLatest(LessonTypes.LOAD_LESSON_SAGA, loadLesson),
    takeLatest(PlaybackTypes.PLAYBACK_START, play),

    // some sagas receive extra parameters in addition to an action
    takeLatest(TemperatureTypes.TEMPERATURE_REQUEST, getTemperature, api)
  ]
}
