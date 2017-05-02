// @flow

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import Sound from 'react-native-sound'
import BackgroundTimer from 'react-native-background-timer'

import VolumeSlider from '../Components/VolumeSlider'
import SpeedSlider from '../Components/SpeedSlider'
import API from '../Services/TranslateApi'
import makeCancelable from '../Lib/MakeCancelable'
import PlaybackActions from '../Redux/PlaybackRedux'
import LessonActions, { LESSON_LOOP_MAX } from '../Redux/LessonRedux'
import Player from '../Services/Player'
import LessonHelper from '../Services/LessonHelper'
import CardHelper from '../Services/CardHelper'

// Styles
// import styles from './Styles/PlayerStyle'

const TRANSLATION_LOOP_MAX = 3
const ORIGINAL_TIMEOUT = 1000
const ORIGINAL_TIMEOUT_SLEEP = 5000
const TRANSLATION_TIMEOUT = 1000
const TRANSLATION_TIMEOUT_SLEEP = 5000
const NEXT_WORD_TIMEOUT = 2000
const NEXT_WORD_TIMEOUT_SLEEP = 5000
const REPEAT_ALL_TIMEOUT = 4000
const REPEAT_ALL_TIMEOUT_SLEEP = 4000

class PlayerScreen extends React.Component {
  constructor (props: Object) {
    super(props)
    this.api = API.create()
    this.state = {
      // Set your state here
    }
    this._cancelablePromise = null
    this._ttsDeferred = null

    // Enable playback in silence mode (iOS only)
    Sound.setCategory('Playback', true)

    this.scheduleTimer()

    this.setModifiers()

    this.props.loadPlayingState()
  }

  scheduleTimer () {
    BackgroundTimer.setTimeout(() => {
      // Force component to stop right now. Pop() will be called once the app is active.
      this.componentWillUnmount()
      NavigationActions.pop()
    }, 60 * 60 * 1000)
  }

  componentDidUpdate (prevProps) {
    const {translationLoopCounter, playingState} = this.props
    const {playing} = this.props.playback

    if (prevProps.playback.playing !== playing && !playing) { // PLAYBACK_SUCCESS
      this.props.loadPlayingState()
    }

    if (prevProps.playingState !== playingState || prevProps.translationLoopCounter !== translationLoopCounter) {
      switch (playingState) {
        case 'ORIGINAL':
          this.delay(this.originalTimeout).then(() => this.playCard())
          break
        case 'TRANSLATION':
          this.delay(this.translationTimeout).then(() => this.playCard())
          break
        case 'RESTART':
          // todo: should happen before word incremented/loop restarted?
          this.delay(this.repeatAllTimeout).then(() => this.playMessageEnd())
          break
      }
    }

    // if (nextProps.currentWord !== this.props.currentWord ||
    //   // forcePlay is set when using the prev/next button on the same word (first/last words)
    //   (nextProps.sameWord && this.forcePlay)
    // //  Sleeping mode
    // // !this.isFocusMode()
    // ) {
    //   this.forcePlay = false
    //   promise.then(() => this.speakWord(nextProps.currentWord))
    // }
  }

  componentWillUnmount () {
    this.cancelPromises()
    this.props.setPaused(true)
  }

  cancelPromises () {
    Player.cancel()
    this._cancelablePromise.cancel()
  }

  delay (ms) {
    return this.makeCancelable(
      new Promise(function (resolve, reject) {
        BackgroundTimer.setTimeout(resolve, ms)
      })
    )
  }

  makeCancelable (promise) {
    this._cancelablePromise = makeCancelable(promise)
    this._cancelablePromise.promise
      .catch((err) => {
        if (!err.isCanceled) {
          console.log(err && err.stack)
        }
      })
    return this._cancelablePromise.promise
  }

  isFocusMode () {
    return this.props.lessonLoopCounter <= LESSON_LOOP_MAX
  }

  setModifiers () {
    const isFocusMode = this.isFocusMode()
    this.volume = isFocusMode ? 1 : 0.4

    this.originalTimeout = isFocusMode ? ORIGINAL_TIMEOUT : ORIGINAL_TIMEOUT_SLEEP
    this.translationTimeout = isFocusMode ? TRANSLATION_TIMEOUT : TRANSLATION_TIMEOUT_SLEEP
    this.nextWordTimeout = isFocusMode ? NEXT_WORD_TIMEOUT : NEXT_WORD_TIMEOUT_SLEEP
    this.repeatAllTimeout = isFocusMode ? REPEAT_ALL_TIMEOUT : REPEAT_ALL_TIMEOUT_SLEEP

    this.speed = (isFocusMode ? 0.6 : 0.4)
    // this.rateOriginal = speed
    // this.rateTranslation = speed
  }

  loopStart () {
    this.setModifiers()
    this.playCard()
  }

  playCard () {
    const {currentCard, speed, volume, playingState} = this.props
    const sentence = currentCard.fullSentence ? currentCard.fullSentence : currentCard.sentence
    const translation = playingState === 'TRANSLATION'
    const sentenceStr = translation ? sentence.translation : sentence.original
    const language = translation ? 'th-TH' : 'en-US'

    this.props.play(sentenceStr, language, this.speed * speed, this.volume * volume)
  }

  playMessageEnd () {
    const {speed, volume} = this.props
    var sentenceStr
    if (this.isFocusMode()) {
      sentenceStr = 'Repeat'
    } else if (this.props.lessonLoopCounter === LESSON_LOOP_MAX + 1) {
      sentenceStr = 'Good night'
    }
    this.props.play(sentenceStr, 'en-US', this.speed * speed, this.volume * volume)
  }

  stopPlayback () {
    // todo: crashes for no reason
    NavigationActions.pop()
    // NavigationActions.lesson(this.props.currentLessonId)
  }

  resumePlayback () {
    this.props.setPaused(false)
    // Restart word playback from original
    this.speakWord()
  }

  pausePlayback () {
    this.cancelPromises()
    this.props.setPaused(true)
  }

  previous () {
    this.cancelPromises()
    this.props.decCurrentWord()
    this.forcePlay = true
  }

  next () {
    this.cancelPromises()
    this.props.incCurrentWord(false)
    this.forcePlay = true
  }

  renderPlayPauseButton () {
    if (this.props.isPaused) {
      return (
        <View>
          <TouchableOpacity onPress={this.resumePlayback.bind(this)}>
            <Text>RES</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View>
          <TouchableOpacity onPress={this.pausePlayback.bind(this)}>
            <Text>PAUSE</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderPlaybackButtons () {
    return (
      <View>
        <View>
          <TouchableOpacity onPress={this.previous.bind(this)}>
            <Text>PREV</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.stopPlayback.bind(this)}>
            <Text>STOP</Text>
          </TouchableOpacity>
        </View>
        {this.renderPlayPauseButton()}
        <View>
          <TouchableOpacity onPress={this.next.bind(this)}>
            <Text>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  durationStr (ms) {
    var hours = Math.floor(ms / 1000 / 3600)
    var mins = Math.round(ms / 1000 / 60 - (hours * 60))
    var str = ''
    if (hours) {
      str += hours + 'h '
    }

    str += mins + 'mins'
    return str
  }

  renderTime () {
    const wordDuration = 2000 // Average time to load one file + play
    const repeatingSentenceDuration = 2000 // Average time to play repeating sentence
    const originalDuration = wordDuration + this.originalTimeout
    const translationDuration = (wordDuration + this.translationTimeout) * TRANSLATION_LOOP_MAX + this.nextWordTimeout
    const loopDuration = (originalDuration + translationDuration) * this.props.currentCards.length
    const totalDuration = (loopDuration + this.repeatAllTimeout + repeatingSentenceDuration + this.originalTimeout) *
      (LESSON_LOOP_MAX - 1) + loopDuration

    return (
      <View>
        <Text>~ Loop Duration: {this.durationStr(loopDuration)}</Text>
        <Text>~ Total Duration: {this.durationStr(totalDuration)}</Text>
      </View>
    )
  }

  render () {
    return (
      <View>
        {this.renderPlaybackButtons()}
        <View>
          {this.renderTime()}
          <VolumeSlider volume={this.props.volume} onChange={(volume) => this.props.changeVol(volume)} />
          <SpeedSlider speed={this.props.speed} onChange={(speed) => this.props.changeSpeed(speed)} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const lessonHelper = new LessonHelper(state.lesson)
  const cardHelper = new CardHelper(state.lesson)

  return {
    volume: state.playback.volume,
    speed: state.playback.speed,
    lessonLoopCounter: state.lesson.lessonLoopCounter,
    translationLoopCounter: state.lesson.translationLoopCounter,
    playingState: state.lesson.playingState,
    sameWord: state.lesson.sameWord,
    isPaused: state.playback.isPaused,
    playback: state.playback,
    currentCard: cardHelper.currentCard,
    currentCards: lessonHelper.currentCards()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    incCurrentWord: (allowRestart) => dispatch(LessonActions.incCurrentWord(allowRestart)),
    decCurrentWord: () => dispatch(LessonActions.decCurrentWord()),
    setPaused: (val) => dispatch(PlaybackActions.playbackSetPaused(val)),
    changeVol: (volume) => dispatch(PlaybackActions.playbackVolChange(volume)),
    changeSpeed: (speed) => dispatch(PlaybackActions.playbackSpeedChange(speed)),
    play: (sentence, language, volume, speed) => dispatch(
      PlaybackActions.playbackStart(sentence, language, volume, speed)),
    loadPlayingState: () => dispatch(LessonActions.loadPlayingState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen)
