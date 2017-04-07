// @flow

import RNFS from 'react-native-fs'
import md5Hex from 'md5-hex'

import API from './TranslateApi'
import loadSound from './Sound'
import makeCancelable from '../Lib/MakeCancelable'

this.api = API.create()

const makeCancelableWrapper = (promise) => {
  this._cancelablePromise = makeCancelable(promise)
  this._cancelablePromise.promise
    .catch((err) => {
      if (!err.isCanceled) {
        console.log(err && err.stack)
      }
    })
  return this._cancelablePromise.promise
}

const downloadAudioIfNeeded = (word, language, rate) => {
  const fileName = md5Hex(word) + '.mp3'
  const path = RNFS.DocumentDirectoryPath + '/cache/' + fileName
  const url = this.api.ttsURL(word, language, rate)

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

  return makeCancelableWrapper(promise)
}

const speakWordInLanguage = (word, language, rate) => {
  var deviceTTS = false
  if (deviceTTS) {
    return this.playTTS()
  } else {
    return downloadAudioIfNeeded(word, language, rate)
      .then((fileName) => {
        // this._sound = loadSound(fileName, this.volume * this.props.volume)
        this._sound = loadSound(fileName, 1)
        return this._sound.promise
      })
  }
}

export default {
  speakWordInLanguage
}
