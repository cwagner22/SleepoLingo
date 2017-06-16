// @flow

import Sound from 'react-native-sound'
import Deferred from '../Lib/Deferred'

const loadSound = (path, volume = 1, speed = 0.7) => {
  var dfd = new Deferred() // To resolve promise from outside scope
  var sound = null
  // var _hasFinished = false

  sound = new Sound(path, '', (error) => {
    if (error) {
      console.log('failed to load the sound', error)
      return dfd.reject(error)
    }

    sound
      .setVolume(volume)
      .setSpeed(speed)

    play()
  })

  const play = () => {
    sound
      .play((success) => {
        if (success) {
          dfd.resolve()
        } else {
          dfd.reject(new Error({isCanceled: true}))
        }
      })
  }

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
    },
    setVolume (volume) {
      sound.setVolume(volume)
    }
  }
}

export default loadSound
