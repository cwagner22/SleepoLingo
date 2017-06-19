import { call, put, fork, select, cancel, cancelled, takeLatest, spawn } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import BackgroundTimer from 'react-native-background-timer'
import Sound from 'react-native-sound'
import Promise from 'bluebird'
import moment from 'moment'
import Debug from 'debug'

import Player from '../Services/Player'
import loadSound from '../Services/Sound'
import PlaybackActions, { PlaybackTypes } from '../Redux/PlaybackRedux'
import LessonActions from '../Redux/LessonRedux'
import { Lesson, Card } from '../Realm/realm'

Debug.enable('app:player')
const debug = Debug('app:player')

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

var sound, task, playerLoopProcessTask, progressTask
var playingState
var lessonLoopCounter
var translationLoopCounter
var currentCardId
var currentIndex
var cachedFilesDurations

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
  const currentCard = Card.getFromId(currentCardId)
  const playbackState = yield select(getPlaybackState)

  const {speed, volume} = playbackState
  const sentence = currentCard.getSentence()
  const translation = playingState === 'TRANSLATION'
  const sentenceStr = translation ? sentence.translation : sentence.original
  const language = translation ? 'th-TH' : 'en-US'

  yield put(PlaybackActions.setLessonLoopCounter(lessonLoopCounter))
  yield put(LessonActions.setCurrentCard(currentCardId))
  yield put(PlaybackActions.setPlayingState(playingState))

  yield call(play, sentenceStr, language, this.volume * volume, this.speed * speed)
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
  }
  yield cancel(playerLoopProcessTask)
}

function * forcePlayerWithLoadedCard () {
  translationLoopCounter = 0
  playingState = 'ORIGINAL'
  playerLoopProcessTask = yield fork(playerLoopProcess)
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
  yield cancel(progressTask)
  yield put(PlaybackActions.playbackSetPaused(true))
}

export function * playerResume () {
  progressTask = yield spawn(calculateProgress)
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

  // if (!currentIndex) {
  //   // Init
  //   currentIndex = 0
  // } else {
  // var currentIndex = currentCards.findIndex((c) => c.id === lessonState.currentCardId)

  if (lessonState.currentCardId) {
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
      currentIndex = Math.max(0, currentIndex)
    } else {
      currentIndex = Math.max(0, --currentIndex)
    }
  }
  // }

  currentCardId = currentCards[currentIndex].id
}

export function * loadPlayingState (action) {
  if (!playerShouldContinue()) {
    yield cancel(playerLoopProcessTask)
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

  if (action.type === PlaybackTypes.PLAYBACK_SUCCESS && playingState === 'ORIGINAL') {
    debug('Restart calculateProgress')
    yield cancel(progressTask)
    progressTask = yield spawn(calculateProgress)
  }

  task = yield fork(processPlayingState, action)
}

function * processPlayingState (action) {
  switch (playingState) {
    case 'ORIGINAL':
      const init = action.type === PlaybackTypes.PLAYER_READY
      if (!init) {
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

function * playerLoopProcess () {
  yield put(PlaybackActions.playbackSetPaused(false))
  yield takeLatest([PlaybackTypes.PLAYER_READY, PlaybackTypes.PLAYBACK_SUCCESS], loadPlayingState)
}

export function * start () {
  lessonLoopCounter = 0
  translationLoopCounter = 0
  currentIndex = 0
  playingState = null
  yield call(setModifiers)

  playerLoopProcessTask = yield fork(playerLoopProcess)
  yield put(PlaybackActions.playerReady())
  yield fork(calculateTotalTime)
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

function durationOfFile (path) {
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

function durationOfCards (cards) {
  return Promise.map(cards, (card) => {
    const sentence = card.getSentence()
    return Promise.join(durationOfFile(Player.getFilePath(sentence.original, 'en-US')),
      durationOfFile(Player.getFilePath(sentence.translation, 'th-TH')))
      .then((durations) => {
        return {
          original: durations[0],
          translation: durations[1]
        }
      })
  }, {
    concurrency: 5
  }).then((duration) => {
    cachedFilesDurations = duration
    return duration.reduce((total, d) => total + d.original + d.translation, 0)
  })
}

function * calculateTotalTime () {
  const lessonState = yield select(getLessonState)
  const currentLesson = Lesson.getFromId(lessonState.currentLessonId)
  const currentCards = currentLesson.cards

  let duration = 0

  duration = yield call(durationOfCards, currentCards)
  console.log(`Audio files duration: ${duration}`)

  duration *= 1000 * LESSON_LOOP_MAX

  let timeoutsDuration = getTimeoutsDuration(currentCards.length - 1)
  timeoutsDuration += REPEAT_ALL_TIMEOUT

  const msgsEndDuration = 1200 * LESSON_LOOP_MAX
  duration += timeoutsDuration + msgsEndDuration

  console.log(`Total duration: ${duration}`)
  yield put(PlaybackActions.playbackSetDuration(duration))

  progressTask = yield fork(calculateProgress)
}

function * durationOfFilesCached (index) {
  const playbackState = yield select(getPlaybackState)
  const {speed} = playbackState

  let duration = 0
  for (var i = 0; i < index; i++) {
    var cachedFileDuration = cachedFilesDurations[i]
    duration += cachedFileDuration.original + cachedFileDuration.translation * TRANSLATION_LOOP_MAX
  }

  return duration * 1000 * (1 / (this.speed * speed))
}

function * durationOfFilesCachedTotal (index, nbCards) {
  let filesDuration = 0
  let fullFilesDuration
  for (let i = 0; i < lessonLoopCounter; i++) {
    if (!fullFilesDuration) fullFilesDuration = yield call(durationOfFilesCached, nbCards - 1)
    filesDuration += fullFilesDuration
  }
  filesDuration += yield call(durationOfFilesCached, index)
  return filesDuration
}

function getTimeoutsDuration (index) {
  return index * (TRANSLATION_TIMEOUT * TRANSLATION_LOOP_MAX + NEXT_WORD_TIMEOUT)
}

function getTimeoutsDurationTotal (index) {
  let timeoutsDuration = 0
  for (let i = 0; i < lessonLoopCounter; i++) {
    timeoutsDuration += getTimeoutsDuration()
  }
  timeoutsDuration += getTimeoutsDuration(currentIndex)
  return timeoutsDuration
}

function * getElapsedTime () {
  const lessonState = yield select(getLessonState)
  const currentLesson = Lesson.getFromId(lessonState.currentLessonId)
  // const index = currentLesson.cards.findIndex((c) => c.id === lessonState.currentCardId)
  const nbCards = currentLesson.cards - 1

  const filesDuration = yield call(durationOfFilesCachedTotal, currentIndex, nbCards)
  const timeoutsDuration = getTimeoutsDurationTotal(currentIndex)

  const duration = filesDuration + timeoutsDuration
  debug(`Time previous cards - Total: ${duration.toFixed()}, Files: ${filesDuration.toFixed()}, Timeouts: ${timeoutsDuration.toFixed()}`)
  return duration
}

function * calculateProgress () {
  let startTime = moment()

  while (true) {
    const elaspedTime = yield call(getElapsedTime)
    const totalElaspedTime = elaspedTime + moment().diff(startTime)
    debug(`Time total - ${totalElaspedTime.toFixed()}, Since current card: ${moment().diff(startTime)}`)
    yield put(PlaybackActions.playbackSetElapsedTime(totalElaspedTime))
    yield call(delay, 500)
  }
}
