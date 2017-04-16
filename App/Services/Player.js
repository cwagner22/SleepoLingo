// @flow

import RNFS from 'react-native-fs'
import md5Hex from 'md5-hex'

import API from './TranslateApi'
import loadSound from './Sound'

this.api = API.create()

const downloadAudioIfNeeded = (word, language) => {
  const fileName = md5Hex(word) + '.mp3'
  const path = RNFS.DocumentDirectoryPath + '/cache/' + fileName
  const url = this.api.ttsURL(word, language)

  const promise = RNFS.exists(path)
    .then((exists) => {
      if (!exists) {
        // write the file
        return RNFS.downloadFile({fromUrl: url, toFile: path}).promise
          .then((success) => {
            console.log('FILE WRITTEN!', url, path)
            return fileName
          })
      }

      return fileName
    })

  return promise
}

const speakWordInLanguage = (word, language, speed = 1, volume = 1) => {
  var deviceTTS = false
  if (deviceTTS) {
    return this.playTTS()
  } else {
    return downloadAudioIfNeeded(word, language)
      .then((fileName) => {
        this._sound = loadSound(fileName, volume, speed)
        return this._sound.promise
          .catch(function (err) {
            if (!err.isCanceled) {
              console.log(err && err.stack)
            }
          })
      })
  }
}

const cancel = () => {
  this._sound && this._sound.cancel()
}

export default {
  speakWordInLanguage,
  cancel
}
