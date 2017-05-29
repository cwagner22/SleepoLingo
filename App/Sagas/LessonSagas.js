import { call, select, put, race } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import md5Hex from 'md5-hex'
// import { NavigationActions } from 'react-navigation'
import { Alert } from 'react-native'

import API from '../Services/TranslateApi'
import LessonActions from '../Redux/LessonRedux'
import NavigatorService from '../Services/Navigator'

const api = API.create()

// const getCurrentLesson = (state) => state.lesson.currentLesson
const getCurrentLessonId = (state) => state.lesson.currentLessonId

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

// Because of the way "call" works, if we want to "put" an action
// after a callback is invoked, we can return a promise that is
// bound to resolve when the callback is invoked
function bindCallbackToPromise () {
  let _resolve
  const promise = () => {
    return new Promise((resolve) => {
      _resolve = resolve
    })
  }
  const cb = (args) => _resolve(args)

  return {
    promise,
    cb
  }
}

export function * loadLesson ({lesson}) {
  // Reset cards if new lesson
  const currentLessonId = yield select(getCurrentLessonId)
  if (lesson.id !== currentLessonId) {
    const cancel = bindCallbackToPromise()
    const confirm = bindCallbackToPromise()

    Alert.alert(
      'New Lesson',
      'You\'ve another lesson in progress.',
      [
        {text: 'Start new lesson', onPress: confirm.cb},
        {text: 'Cancel', onPress: cancel.cb}
      ]
    )

    // The race will wait for either the cancel or confirm callback to be invoked - which skirts
    // around the problem of trying to "put" from within a callback: don't put an event, instead
    // rely strictly on the resolution of a promise
    const res = yield race({
      cancel: call(cancel.promise),
      confirm: call(confirm.promise)
    })

    if (res.hasOwnProperty('confirm')) {
      yield put(LessonActions.resetDates())
      yield put(LessonActions.setCurrentLesson(lesson))
      yield call(NavigatorService.navigate, 'LessonScreen', {lesson})
    } else {
      yield call(NavigatorService.reset, 'LessonsListScreen')
    }
  } else {
    yield put(LessonActions.setCurrentLesson(lesson))
    yield call(NavigatorService.navigate, 'LessonScreen', {lesson})
    // yield put(NavigationActions.navigate({ routeName: 'LessonScreen', params: {lesson} }))
  }
}

// function * updateCardDate (date) {
//   const currentCard = yield select(getCurrentCard)
//   // yield call(setDate, currentCard, date)
//   yield put(LessonActions.setDate(currentCard.id, date.toDate()))
// }
//
// export function * ankiHard () {
//   yield call(updateCardDate, moment().add(1, 'm'))
// }
//
// export function * ankiOk () {
//   yield call(updateCardDate, moment().add(10, 'm'))
// }
//
// export function * ankiEasy () {
//   yield call(updateCardDate, moment().add(1, 'd'))
// }
