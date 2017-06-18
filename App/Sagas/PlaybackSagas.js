import { call, put, fork, select, cancel, cancelled, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import BackgroundTimer from 'react-native-background-timer'
import Sound from 'react-native-sound'
import Promise from 'bluebird'
import moment from 'moment'

import Player from '../Services/Player'
import loadSound from '../Services/Sound'
import PlaybackActions, { PlaybackTypes } from '../Redux/PlaybackRedux'
import LessonActions from '../Redux/LessonRedux'
import { Lesson, Card } from '../Realm/realm'

export const LESSON_LOOP_MAX = 4
const TRANSLATION_LOOP_MAX = 3
// const ORIGINAL_TIMEOUT = 1000
// const ORIGINAL_TIMEOUT_SLEEP = 2000
const TRANSLATION_TIMEOUT = 1000
const TRANSLATION_TIMEOUT_SLEEP = 2000
const NEXT_WORD_TIMEOUT = 2000
const NEXT_WORD_TIMEOUT_SLEEP = 4000
const REPEAT_ALL_TIMEOUT = 4000
const REPEAT_ALL_TIMEOUT_SLEEP = 4000

const getLessonState = (state) => state.lesson
const getPlaybackState = (state) => state.playback

var sound, task, playerLoopTask
var playingState
var lessonLoopCounter
var translationLoopCounter
var currentCardId
// var time

// Replicate redux-saga/delay with react-native-background-timer
const bgDelay = (ms, val = true) => {
  let timeoutId
  const promise = new Promise(resolve => {
    timeoutId = BackgroundTimer.setTimeout(() => resolve(val), ms)
  })

  promise['@@redux-saga/cancelPromise'] = () => BackgroundTimer.clearTimeout(timeoutId)

  return promise
}

export function * playSaga ({sentence, language, volume, speed}) {
  yield call(play, sentence, language, volume, speed)
}

function * play (sentence, language, volume, speed) {
  try {
    const path = Player.getFilePath(sentence, language)
    sound = yield call(loadSound, path, volume, speed)
    yield sound.promise
    yield put(PlaybackActions.playbackSuccess())
  } catch (e) {
    console.error(e)
    yield put(PlaybackActions.playbackError(e))
  } finally {
    if (cancelled()) {
      sound.cancel()
    }
  }
}

function * playCard () {
  // const lessonState = yield select(getLessonState)
  const currentCard = Card.getFromId(currentCardId)
  const playbackState = yield select(getPlaybackState)

  const {speed, volume} = playbackState
  const sentence = currentCard.fullSentence ? currentCard.fullSentence : currentCard.sentence
  const translation = playingState === 'TRANSLATION'
  const sentenceStr = translation ? sentence.translation : sentence.original
  const language = translation ? 'th-TH' : 'en-US'

  yield put(PlaybackActions.setLessonLoopCounter(lessonLoopCounter))
  yield put(LessonActions.setCurrentCard(currentCardId))
  yield put(PlaybackActions.setPlayingState(playingState))
  yield call(play, sentenceStr, language, this.volume * volume, this.speed * speed)
  // add duration to elapsed time
}

function * playMessageEnd () {
  const playbackState = yield select(getPlaybackState)
  const {speed, volume} = playbackState
  var sentenceStr
  if (!isFocusMode()) {
    sentenceStr = 'Good night'
  } else {
    sentenceStr = 'Repeat'
  }
  yield call(play, sentenceStr, 'en-US', this.volume * volume, this.speed * speed)
}

export function * playerStop () {
  if (task) {
    yield cancel(task)
    yield cancel(playerLoopTask)
  }
}

function * forcePlayerWithLoadedCard () {
  translationLoopCounter = 0
  playingState = 'ORIGINAL'
  playerLoopTask = yield fork(playerLoop)
  task = yield fork(playCard)
}

export function * playerNext () {
  yield call(playerStop)
  yield call(loadNextCard)
  yield call(forcePlayerWithLoadedCard)
}

export function * playerPrev () {
  yield call(playerStop)
  yield call(loadPrevCard)
  yield call(forcePlayerWithLoadedCard)
}

export function * playerPause () {
  yield call(playerStop)
  yield put(PlaybackActions.playbackSetPaused(true))
}

export function * playerResume () {
  yield put(PlaybackActions.playbackSetPaused(false))
  yield call(forcePlayerWithLoadedCard)
}

export function * loadNextCard () {
  yield call(loadCard, true)
}

export function * loadPrevCard () {
  yield call(loadCard, false)
}

export function * loadCard (next: true) {
  playingState = 'ORIGINAL'
  const lessonState = yield select(getLessonState)
  const currentLesson = Lesson.getFromId(lessonState.currentLessonId)
  const currentCards = currentLesson.cards

  if (!lessonState.currentCardId) {
    // Init
    currentCardId = currentCards[0].id
  } else {
    var currentIndex = currentCards.findIndex((c) => c.id === lessonState.currentCardId)

    if (next) {
      if (++currentIndex >= currentCards.length) {
        // if (allowRestart) {
        // if (state.lessonLoopCounter < LESSON_LOOP_MAX) {
        lessonLoopCounter++
        currentIndex = 0
        // } else {
        //   index = currentCards.length - 1
        // }
        // } else {
        //
        // }
      }
      currentCardId = currentCards[Math.max(0, currentIndex)].id
    } else {
      currentCardId = currentCards[Math.max(0, --currentIndex)].id
    }
  }
}

export function * loadPlayingState (action) {
  if (!playerShouldContinue()) {
    yield cancel(playerLoopTask)
    return
  }

  if (!playingState) {
    // init
    yield call(loadNextCard)
  } else if (playingState === 'ORIGINAL') {
    // translation
    playingState = 'TRANSLATION'
  } else if (playingState === 'TRANSLATION') {
    if (++translationLoopCounter >= TRANSLATION_LOOP_MAX) {
      // next word
      const oldlessonLoopCounter = lessonLoopCounter
      yield call(loadNextCard)
      // newState = navigateCurrentWord(state, action)
      translationLoopCounter = 0
      if (lessonLoopCounter !== oldlessonLoopCounter) {
        playingState = 'RESTART'
      }
    }
  } else if (playingState === 'RESTART') {
    playingState = 'ORIGINAL'
  }

  task = yield fork(processPlayingState, action)
}

function * processPlayingState (action) {
  switch (playingState) {
    case 'ORIGINAL':
      if (action.type === PlaybackTypes.PLAYBACK_SUCCESS) {
        yield call(bgDelay, this.nextWordTimeout)
      }
      // yield call(bgDelay, this.originalTimeout)
      yield call(playCard)
      break
    case 'TRANSLATION':
      yield call(bgDelay, this.translationTimeout)
      yield call(playCard)
      break
    case 'RESTART':
      yield call(setModifiers)
      yield call(bgDelay, this.nextWordTimeout)
      yield call(playMessageEnd)
      yield call(bgDelay, this.repeatAllTimeout)
      break
  }
}

function setModifiers () {
  const _isFocusMode = isFocusMode()
  this.volume = _isFocusMode ? 1 : 0.8

  // this.originalTimeout = _isFocusMode ? ORIGINAL_TIMEOUT : ORIGINAL_TIMEOUT_SLEEP
  this.translationTimeout = _isFocusMode ? TRANSLATION_TIMEOUT : TRANSLATION_TIMEOUT_SLEEP
  this.nextWordTimeout = _isFocusMode ? NEXT_WORD_TIMEOUT : NEXT_WORD_TIMEOUT_SLEEP
  this.repeatAllTimeout = _isFocusMode ? REPEAT_ALL_TIMEOUT : REPEAT_ALL_TIMEOUT_SLEEP

  this.speed = _isFocusMode ? 0.55 : 0.45
  // this.rateOriginal = speed
  // this.rateTranslation = speed
}

export const isFocusMode = () => lessonLoopCounter < LESSON_LOOP_MAX - 1

const playerShouldContinue = () => lessonLoopCounter < LESSON_LOOP_MAX

function * playerLoop () {
  yield takeLatest([PlaybackTypes.PLAYER_READY, PlaybackTypes.PLAYBACK_SUCCESS], loadPlayingState)
}

export function * start () {
  lessonLoopCounter = 0
  translationLoopCounter = 0
  playingState = null
  yield call(setModifiers)
  playerLoopTask = yield fork(playerLoop)
  yield put(PlaybackActions.playerReady())
  yield put(PlaybackActions.playbackSetPaused(false))
  yield fork(calculateTotalTime)
  yield fork(calculateProgress)
}

export function * playerVolChange ({volume}) {
  if (sound) {
    sound.setVolume(volume)
  }
}

export function * playerSpeedChange ({speed}) {
  if (sound) {
    const playbackState = yield select(getPlaybackState)
    sound.setSpeed(playbackState.speed)
  }
}

function _durationOfFile (path) {
  return new Promise((resolve, reject) => {
    const _sound = new Sound(path, '', (error) => {
      if (error) {
        console.log('failed to load the sound', error)
        reject(error)
      }

      if (!_sound.getDuration()) {
        console.log(path, 'no duration')
      }
      resolve(_sound.getDuration())
    })
  })
}

function _durationOfFiles (paths) {
  return Promise.map(paths, (path) => {
    return _durationOfFile(path)
  }, {concurrency: 5}).then((duration) => {
    return duration.reduce((d, total) => (total + d))
  })
}

function * calculateTotalTime () {
  const lessonState = yield select(getLessonState)
  const currentLesson = Lesson.getFromId(lessonState.currentLessonId)
  const currentCards = currentLesson.cards

  let duration = 0

  const paths = []
  currentCards.map(c => {
    const sentence = c.getSentence()
    paths.push(Player.getFilePath(sentence.original, 'en-US'))
    paths.push(Player.getFilePath(sentence.translation, 'th-TH'))
  })

  duration = yield call(_durationOfFiles, paths)
  console.log(duration)

  duration *= 1000 * LESSON_LOOP_MAX

  let timeoutsDuration = (currentCards.length - 1) * (TRANSLATION_TIMEOUT * TRANSLATION_LOOP_MAX + NEXT_WORD_TIMEOUT)
  timeoutsDuration += REPEAT_ALL_TIMEOUT

  const msgsEndDuration = 1200 * LESSON_LOOP_MAX
  duration += timeoutsDuration + msgsEndDuration

  console.log(duration)
  yield put(PlaybackActions.playbackSetDuration(duration))
}

function * calculateProgress () {
  let startTime = moment()

  while (true) {
    yield call(delay, 1000)
    const elaspedTime = moment().diff(startTime)
    yield put(PlaybackActions.playbackSetElapsedTime(elaspedTime))
  }
  // const lessonState = yield select(getLessonState)
  // const playbackState = yield select(getPlaybackState)
  // const elapsed =
}
