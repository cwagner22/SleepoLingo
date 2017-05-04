// @flow

import Sound from 'react-native-sound'
import Deferred from '../Lib/Deferred'

const loadSound = (path, volume = 1, speed = 0.7) => {
  var dfd = new Deferred() // no need anymore, use simple promise?
  var sound = null
  // var _hasFinished = false

  const play = function () {
    sound
      .setVolume(volume)
      .setSpeed(speed)
      .play((success) => {
        // _hasFinished = true
        if (success) {
          dfd.resolve()
        } else {
          dfd.reject({isCanceled: true})
        }
      })
  }

  sound = new Sound(path, '', (error) => {
    if (error) {
      console.log('failed to load the sound', error)
      return dfd.reject()
    }
    // loaded successfully
    console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels())

    play()
  })

  // return dfd.promise

  return {
    promise: dfd.promise,
    pause () {
      sound.pause()
    },
    resume () {
      play()
    },
    cancel () {
      sound.stop()
      // if (!_hasFinished) {
      //   dfd.reject({isCanceled: true})
      // }
    }
  }
}

export default loadSound
