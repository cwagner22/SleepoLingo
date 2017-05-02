import { call, put } from 'redux-saga/effects'

import Player from '../Services/Player'
import PlaybackActions from '../Redux/PlaybackRedux'
import loadSound from '../Services/Sound'

export function * play (action) {
  try {
    const {sentence, language, volume, speed} = action
    const path = Player.getFilePath(sentence, language)
    yield call(loadSound, path, volume, speed)
    // this._sound =
    // this._sound.promise
    //   .then(() => {
    //     yield put(LessonActions.temperatureSuccess())
    //   })
    //   .catch(function (err) {
    //     if (!err.isCanceled) {
    //       console.log(err && err.stack)
    //     }
    //     yield put(LessonActions.temperatureFailure())
    //   })
    yield put(PlaybackActions.playbackSuccess())
  } catch (error) {
    console.error(error)
    yield put(PlaybackActions.playbackError())
  }
}
