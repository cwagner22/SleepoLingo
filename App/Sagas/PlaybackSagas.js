import { call, put, fork, select, cancel, cancelled, takeLatest } from 'redux-saga/effects'
import BackgroundTimer from 'react-native-background-timer'

import Player from '../Services/Player'
import loadSound from '../Services/Sound'
import PlaybackActions, { PlaybackTypes } from '../Redux/PlaybackRedux'
import LessonActions from '../Redux/LessonRedux'
import { Lesson, Card } from '../Realm/realm'

export const LESSON_LOOP_MAX = 2
const TRANSLATION_LOOP_MAX = 3
const ORIGINAL_TIMEOUT = 1000
const ORIGINAL_TIMEOUT_SLEEP = 5000
const TRANSLATION_TIMEOUT = 1000
const TRANSLATION_TIMEOUT_SLEEP = 5000
const NEXT_WORD_TIMEOUT = 2000
const NEXT_WORD_TIMEOUT_SLEEP = 5000
const REPEAT_ALL_TIMEOUT = 4000
const REPEAT_ALL_TIMEOUT_SLEEP = 4000

const getLessonState = (state) => state.lesson
const getPlaybackState = (state) => state.playback

var sound, task, playerLoopTask
var playingState
var lessonLoopCounter
var translationLoopCounter

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
  const lessonState = yield select(getLessonState)
  const currentCard = Card.getFromId(lessonState.currentCardId)
  const playbackState = yield select(getPlaybackState)

  const {speed, volume} = playbackState
  const sentence = currentCard.fullSentence ? currentCard.fullSentence : currentCard.sentence
  const translation = playingState === 'TRANSLATION'
  const sentenceStr = translation ? sentence.translation : sentence.original
  const language = translation ? 'th-TH' : 'en-US'

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
    yield cancel(playerLoopTask)
  }
}

function * forcePlayerWithLoadedCard () {
  translationLoopCounter = 0
  // playingState = 'ORIGINAL'
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
  translationLoopCounter = 0
  playingState = null
  playerLoopTask = yield fork(playerLoop)
  yield put(PlaybackActions.playerReady())
  yield put(PlaybackActions.playbackSetPaused(false))
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
  let currentCardId

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

  yield put(PlaybackActions.setLessonLoopCounter(lessonLoopCounter))
  yield put(LessonActions.setCurrentCard(currentCardId))
}

export function * loadPlayingState () {
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

  task = yield fork(processPlayingState)
}

function * processPlayingState () {
  switch (playingState) {
    case 'ORIGINAL':
      yield call(bgDelay, this.originalTimeout)
      yield call(playCard)
      break
    case 'TRANSLATION':
      yield call(bgDelay, this.translationTimeout)
      yield call(playCard)
      break
    case 'RESTART':
      yield call(setModifiers)
      yield call(bgDelay, this.repeatAllTimeout)
      // todo: should happen before word incremented/loop restarted?
      yield call(playMessageEnd)
      break
  }
}

function setModifiers () {
  const _isFocusMode = isFocusMode()
  this.volume = _isFocusMode ? 1 : 0.4

  this.originalTimeout = _isFocusMode ? ORIGINAL_TIMEOUT : ORIGINAL_TIMEOUT_SLEEP
  this.translationTimeout = _isFocusMode ? TRANSLATION_TIMEOUT : TRANSLATION_TIMEOUT_SLEEP
  this.nextWordTimeout = _isFocusMode ? NEXT_WORD_TIMEOUT : NEXT_WORD_TIMEOUT_SLEEP
  this.repeatAllTimeout = _isFocusMode ? REPEAT_ALL_TIMEOUT : REPEAT_ALL_TIMEOUT_SLEEP

  this.speed = (_isFocusMode ? 0.6 : 0.4)
  // this.rateOriginal = speed
  // this.rateTranslation = speed
}

const isFocusMode = () => lessonLoopCounter < LESSON_LOOP_MAX - 1

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
}
