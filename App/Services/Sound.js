// @flow

import Sound from 'react-native-sound'
import Deferred from '../Lib/Deferred'

const loadSound = (fileName, volume, speed) => {
  var dfd = new Deferred()
  var sound = null
  var _hasFinished = false

  const play = function () {
    sound
      .setVolume(volume)
      .setSpeed(speed)
      .play((success) => {
        _hasFinished = true
        if (success) {
          dfd.resolve()
        } else {
          dfd.reject({isCanceled: true})
        }
      })
  }

  sound = new Sound('cache/' + fileName, Sound.DOCUMENT, (error) => {
    if (error) {
      console.log('failed to load the sound', error)
      return dfd.reject()
    }
    // loaded successfully
    console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels())

    play()
  })

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
      if (!_hasFinished) {
        dfd.reject({isCanceled: true})
      }
    }
  }
}

export default loadSound
