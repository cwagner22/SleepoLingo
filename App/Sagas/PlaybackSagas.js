import { call, put, fork, select, cancel, cancelled, takeEvery } from 'redux-saga/effects'
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

var sound, playerLoopProcessTask, progressTask
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
  // if (task) {
  //   yield cancel(task)
  // }
  yield cancel(progressTask)
  yield cancel(playerLoopProcessTask)
}

function * forcePlayerWithLoadedCard () {
  translationLoopCounter = 0
  playingState = 'ORIGINAL'
  playerLoopProcessTask = yield fork(playerLoopProcess)
  progressTask = yield fork(calculateProgress)
  yield fork(playCard)
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
    yield cancel(progressTask)
    progressTask = yield fork(calculateProgress)
  }

  yield call(processPlayingState, action)
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
  // takeLatest cancelled the task at the end for no reason
  yield takeEvery([PlaybackTypes.PLAYER_READY, PlaybackTypes.PLAYBACK_SUCCESS], loadPlayingState)
}

export function * start () {
  lessonLoopCounter = 0
  translationLoopCounter = 0
  currentIndex = 0
  playingState = null
  cachedFilesDurations = null
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

  yield cancel(progressTask)
  yield fork(calculateTotalTime)
}

function * calculateTotalTime () {
  const lessonState = yield select(getLessonState)
  const currentLesson = Lesson.getFromId(lessonState.currentLessonId)
  const nbCards = currentLesson.cards.length

  const filesDuration = yield call(durationOfFilesTotal, LESSON_LOOP_MAX - 1, nbCards - 1, nbCards)
  const timeoutsDuration = getTimeoutsDurationTotal(LESSON_LOOP_MAX - 1, nbCards - 1, nbCards)

  const duration = timeoutsDuration + timeoutsDuration

  console.log(`Total duration: ${duration.toFixed()}, Files duration: ${filesDuration.toFixed()}, Timeouts duration: ${timeoutsDuration.toFixed()}`)
  yield put(PlaybackActions.playbackSetDuration(duration))

  progressTask = yield fork(calculateProgress)
}

function fileDuration (path) {
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

function cacheFilesDurations (currentCards) {
  debug('Caching files durations')

  return Promise.map(currentCards, (card) => {
    const sentence = card.getSentence()

    return Promise.join(fileDuration(Player.getFilePath(sentence.original, 'en-US')),
      fileDuration(Player.getFilePath(sentence.translation, 'th-TH')))
      .then((durations) => {
        return {
          original: durations[0],
          translation: durations[1]
        }
      })
  }, {
    concurrency: 5
  }).then((durations) => {
    debug(durations)
    cachedFilesDurations = durations
  })
}

const applySpeedToFileDuration = (duration, speed) => duration * 1000 * (1 / (this.speed * speed))

function * durationOfFiles (index) {
  const playbackState = yield select(getPlaybackState)
  const {speed} = playbackState

  let duration = 0
  for (var i = 0; i < index; i++) {
    var cachedFileDuration = cachedFilesDurations[i]
    duration += cachedFileDuration.original + cachedFileDuration.translation * TRANSLATION_LOOP_MAX
  }

  return applySpeedToFileDuration(duration, speed)
}

function * durationOfFilesTotal (lessonLoopCounter, index, nbCards) {
  const playbackState = yield select(getPlaybackState)
  const {speed} = playbackState
  const lessonState = yield select(getLessonState)
  const currentLesson = Lesson.getFromId(lessonState.currentLessonId)
  const currentCards = currentLesson.cards
  if (!cachedFilesDurations) {
    yield call(cacheFilesDurations, currentCards)
  }

  // todo: read real val
  const msgEndDuration = applySpeedToFileDuration(1.0, speed)
  let filesDuration = 0
  let fullFilesDuration
  // Duration from previous loop
  for (let i = 0; i < lessonLoopCounter; i++) {
    if (!fullFilesDuration) fullFilesDuration = yield call(durationOfFiles, nbCards - 1)
    filesDuration += fullFilesDuration + msgEndDuration
  }

  // Current loop duration
  filesDuration += yield call(durationOfFiles, index)

  if (index === nbCards - 1) filesDuration += msgEndDuration
  return filesDuration
}

function getTimeoutsDuration (index) {
  return index * (TRANSLATION_TIMEOUT * TRANSLATION_LOOP_MAX + NEXT_WORD_TIMEOUT)
}

function getTimeoutsDurationTotal (lessonLoopCounter, index, nbCards) {
  let timeoutsDuration = 0
  for (let i = 0; i < lessonLoopCounter; i++) {
    timeoutsDuration += getTimeoutsDuration(nbCards - 1) + REPEAT_ALL_TIMEOUT
  }
  timeoutsDuration += getTimeoutsDuration(currentIndex) + (index === nbCards - 1 ? REPEAT_ALL_TIMEOUT : 0)
  return timeoutsDuration
}

function * getElapsedTime () {
  const lessonState = yield select(getLessonState)
  const currentLesson = Lesson.getFromId(lessonState.currentLessonId)
  // const index = currentLesson.cards.findIndex((c) => c.id === lessonState.currentCardId)
  const nbCards = currentLesson.cards.length

  const filesDuration = yield call(durationOfFilesTotal, lessonLoopCounter, currentIndex, nbCards)
  const timeoutsDuration = getTimeoutsDurationTotal(lessonLoopCounter, currentIndex, nbCards)

  const duration = filesDuration + timeoutsDuration
  debug(
    `Time previous cards - Total: ${duration.toFixed()}, Files: ${filesDuration.toFixed()}, Timeouts: ${timeoutsDuration.toFixed()}`)
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
