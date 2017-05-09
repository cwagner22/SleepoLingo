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
import { ImportTypes } from '../Redux/ImportRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login } from './LoginSagas'
import { getTemperature } from './TemperatureSagas'
import { openScreen } from './OpenScreenSagas'
import { downloadLesson, loadLesson } from './LessonSagas'
import { play, start, playerNext, playerPrev, playerStop } from './PlaybackSagas'
import { importStart } from './ImportSagas'

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
    takeLatest(LessonTypes.LOAD_LESSON, loadLesson),
    // takeLatest(LessonTypes.ANKI_EASY, ankiEasy),
    // takeLatest(LessonTypes.ANKI_OK, ankiOk),
    // takeLatest(LessonTypes.ANKI_HARD, ankiHard),
    // takeLatest(LessonTypes.LOAD_NEXT_CARD, loadNextCard),

    takeLatest(PlaybackTypes.PLAYBACK_START, play),
    takeLatest(PlaybackTypes.PLAYER_START, start),
    takeLatest(PlaybackTypes.PLAYER_NEXT, playerNext),
    takeLatest(PlaybackTypes.PLAYER_PREV, playerPrev),
    takeLatest(PlaybackTypes.PLAYER_STOP, playerStop),

    takeLatest(ImportTypes.IMPORT_START, importStart),

    // some sagas receive extra parameters in addition to an action
    takeLatest(TemperatureTypes.TEMPERATURE_REQUEST, getTemperature, api)
  ]
}
