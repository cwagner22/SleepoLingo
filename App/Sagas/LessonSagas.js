import { call, select, put } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import md5Hex from 'md5-hex'

import API from '../Services/TranslateApi'
import LessonActions from '../Redux/LessonRedux'
import {resetDates} from '../Realm/realm'

const api = API.create()

const getCurrentLesson = (state) => state.lesson.currentLesson

const getFilePath = (sentence, language) => {
  const fileName = md5Hex(sentence) + '.mp3'
  return getLanguagePath(language) + '/' + fileName
}

const getLanguagePath = (language) => {
  return RNFS.CachesDirectoryPath + '/' + language
}

const downloadAudioIfNeeded = (sentence, language) => {
  const path = getFilePath(sentence, language)
  const url = api.ttsURL(sentence, language)

  return RNFS.mkdir(getLanguagePath(language))
    .then(() => RNFS.exists(path))
    .then((exists) => {
      console.log(sentence, path, exists)
      if (!exists) {
        // write the file
        return RNFS.downloadFile({
          fromUrl: url,
          toFile: path,
          background: true
          // progressDivider: 5,
          // progress: onProgress,
        }).promise.then((success) => {
          console.log('FILE WRITTEN!', url, path)
        })
      }
    })
}

export function * downloadLesson (action) {
  const {currentCards} = action

  var items = []
  for (var i = 0; i < currentCards.length; i++) {
    const c = currentCards[i]
    items = items.concat([{
      sentence: c.sentence.original, language: 'en-US'
    }, {
      sentence: c.sentence.translation, language: 'th-TH'
    }])

    if (c.fullSentence) {
      items.push({
        sentence: c.fullSentence.translation, language: 'th-TH'
      })
    }
  }
  items = items.concat([{
    sentence: 'Repeat', language: 'en-US'
  }, {
    sentence: 'Good night', language: 'en-US'
  }])

  yield items.map((item) => call(downloadAudioIfNeeded, item.sentence, item.language))
}

export function * loadLesson ({lesson}) {
  // Reset cards if new lesson
  const currentLesson = yield select(getCurrentLesson)
  if (lesson !== currentLesson) {
    yield call(resetDates, lesson.cards)
    yield put(LessonActions.setCurrentLesson(lesson))
  }
}
