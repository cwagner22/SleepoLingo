// @flow

import Sound from 'react-native-sound'
import Deferred from '../Lib/Deferred'

const loadSound = (fileName, volume) => {
  var dfd = new Deferred()
  var sound = null

  const play = function () {
    sound
    // todo: store volume slider in redux?
    // .setVolume(this.volume * this.refs.volumeSlider.state.value)
      .setVolume(volume)
      .play((success) => {
        if (success) {
          dfd.resolve()
        } else {
          dfd.reject()
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
    }
  }
}

export default loadSound
