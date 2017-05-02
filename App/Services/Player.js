// @flow

import RNFS from 'react-native-fs'
import md5Hex from 'md5-hex'

import API from './TranslateApi'
import loadSound from './Sound'

this.api = API.create()

const speakWordInLanguage = (word, language, speed = 1, volume = 1) => {
  var deviceTTS = false
  if (deviceTTS) {
    return this.playTTS()
  } else {
    // remove file using RNFetchblobResponse.flush() object method
    // return RNFetchBlob.config({
    //   fileCache: true
    // })
    //   .fetch('GET', this.api.ttsURL(word, language))
    //   .then((res) => {
    //     // remove cached file from storage
    //     // res.flush()
    //     console.log(res);return
    //     this._sound = loadSound(res.path, volume, speed)
    //     return this._sound.promise
    //       .catch(function (err) {
    //         if (!err.isCanceled) {
    //           console.log(err && err.stack)
    //         }
    //       })
    //   })

    // return downloadAudioIfNeeded(word, language)
    //   .then((fileName) => {
    const path = RNFS.CachesDirectoryPath + '/' + word.id + '.mp3'
    this._sound = loadSound(path, volume, speed)
    return this._sound.promise
      .catch(function (err) {
        if (!err.isCanceled) {
          console.log(err && err.stack)
        }
      })
    // })
  }
}

const getFilePath = (sentence, language) => {
  const fileName = md5Hex(sentence) + '.mp3'
  return getLanguagePath(language) + '/' + fileName
}

const getLanguagePath = (language) => {
  return RNFS.CachesDirectoryPath + '/' + language
}

const isFocusMode = () => {
  this._sound && this._sound.cancel()
}

const cancel = () => {
  this._sound && this._sound.cancel()
}

export default {
  speakWordInLanguage,
  cancel,
  getFilePath,
  getLanguagePath,
  isFocusMode
}
