// @flow

import React from 'react'
import { View, Text, Slider, TouchableOpacity } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import Tts from 'react-native-tts'
import _ from 'lodash'
import Sound from 'react-native-sound'
import BackgroundTimer from 'react-native-background-timer'

import VolumeSlider from './VolumeSlider'
import API from '../Services/TranslateApi'
import BingAPI from '../Services/BingApi'
import makeCancelable from '../Lib/MakeCancelable'
import Deferred from '../Lib/Deferred'
import PlaybackActions from '../Redux/PlaybackRedux'
import LessonActions from '../Redux/LessonRedux'
import Player from '../Services/Player'
import LessonHelper from '../Services/LessonHelper'

// Styles
// import styles from './Styles/PlayerStyle'

export const LESSON_LOOP_MAX = 2
export const TRANSLATION_LOOP_MAX = 3

class PlayerScreen extends React.Component {
  constructor (props: Object) {
    super(props)
    this.api = API.create()
    this.bingAPI = BingAPI.create()
    this.state = {
      // Set your state here
    }
    this._cancelablePromise = null
    this._ttsDeferred = null

    // Enable playback in silence mode (iOS only)
    Sound.setCategory('Playback', true)

    Tts.addEventListener('tts-start', (event) => console.log('start', event))
    Tts.addEventListener('tts-finish', (event) => {
      console.log('finish', event)
      // Resolve promise
      this.ttsDeferred.resolve()
    })
    Tts.addEventListener('tts-cancel', (event) => console.log('cancel', event))
    // Tts.voices().then(voices => console.log(voices))
  }

  componentWillMount () {
    this.props.incCurrentWord(true)
    this.props.setPaused(false)
    this.setModifiers()
  }

  componentWillReceiveProps (nextProps) {
    var promise = Promise.resolve()
    if (nextProps.lessonLoopCounter !== this.props.lessonLoopCounter) {
      promise = this.speakOriginal('Restarting the lesson')
        .then(() => this.setModifiers())
    }

    if (nextProps.currentWord !== this.props.currentWord ||
      // forcePlay is set when using the prev/next button on the same word (first/last words)
      (nextProps.sameWord && this.forcePlay)
    ) {
      this.forcePlay = false
      promise.then(() => this.speakWord(nextProps.currentWord))
    }
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

  /*
   * Custom "linear" function with offsets
   * Used to get a value proportionally to the time (nb loops)
   * Currently doesn't work if start = end. Also doesn't support x > endX for now
   * Maybe can be improved, I'm not the best at Maths ¯\_ツ_/¯
   * For fun (online graph): https://www.desmos.com/calculator/ivo13pufam
   * Might be possible to apply an easing function (http://easings.net)
   *
   *        +
   * startY |\
   *        | \
   *        |  \
   *        |   \
   *        |    \
   *        |     \
   *        |      \
   *        |       \
   *   endY |        \________
   *        |
   *        |
   *        +-----------------+
   *        startX   endX
   *
   * */
  linearOffsetFn (x, startX, endX, startY, endY) {
    return startY - (startY - endY) * (x / (endX - startX))
  }

  setModifiers () {
    this.originalTimeout = 1000

    // const x = this.props.lessonLoopCounter - 1
    // const startX = 0
    // const endX = LESSON_LOOP_MAX - 1

    this.volume = 1
    // this.volume = this.linearOffsetFn(x, startX, endX, 1, 0.4)

    const translationTimeoutStart = 1000
    // const translationTimeoutEnd = 5000
    // this.translationTimeout = this.linearOffsetFn(x, startX, endX, translationTimeoutStart, translationTimeoutEnd)
    this.translationTimeout = translationTimeoutStart

    const nextWordTimeoutStart = 2000
    // const nextWordTimeoutEnd = 4000
    // this.nextWordTimeout = this.linearOffsetFn(x, startX, endX, nextWordTimeoutStart, nextWordTimeoutEnd)
    this.nextWordTimeout = nextWordTimeoutStart

    const repeatAllTimeoutStart = 4000
    // const repeatAllTimeoutEnd = 10000
    // this.repeatAllTimeout = this.linearOffsetFn(x, startX, endX, repeatAllTimeoutStart, repeatAllTimeoutEnd)
    this.repeatAllTimeout = repeatAllTimeoutStart

    const rateStart = 0.3
    // const rateEnd = 0.2
    this.rateOriginal = rateStart
    // this.rateOriginal = this.linearOffsetFn(x, startX, endX, rateStart, rateEnd)
    this.rateTranslation = rateStart
    // this.rateTranslation = this.linearOffsetFn(x, startX, endX, rateStart, rateEnd)
  }

  onFinishPlayed () {
    // Finish orig + translation
    this.props.incCurrentWord(true)
  }

  playTTS (word, language, rate) {
    return Tts.setDefaultRate(rate)
      .then(() => Tts.setDefaultLanguage(language))
      .then(() => {
        // Will be resolved once plaback finished
        this._ttsDeferred = new Deferred()
        Tts.speak(word)
      })
  }

  speakOriginal (word) {
    return this.makeCancelable(Player.speakWordInLanguage(word, 'en-US', this.rateOriginal))
      .then(() => {
        return this.delay(this.originalTimeout)
      })
  }

  speakTranslation (word) {
    this.translationCounter++

    return this.makeCancelable(Player.speakWordInLanguage(word, 'th-TH', this.rateTranslation))
      .then(() => {
        // Repeat translation 3 times
        if (this.translationCounter < TRANSLATION_LOOP_MAX) {
          return this.delay(this.translationTimeout)
            .then(() => this.speakTranslation(word))
        }
      })
  }

  speakWord (word) {
    var _word = word.full || word

    this.translationCounter = 0
    this.speakOriginal(_word.original)
      .then(() => this.speakTranslation(_word.translation))
      .then(() => this.onFinishPlayed())
      .catch(function (err) {
        if (!err.isCanceled) {
          console.log(err && err.stack)
        }
      })
  }

  translateWords (words) {
    return this.makeCancelable(this.bingAPI.translateArray(words))
      .then((response) => {
        const wordsWithTranslation = []
        const results = response.data
        for (var i = 0; i < results.length; i++) {
          var res = results[i]
          wordsWithTranslation.push({
            original: words[i],
            translation: res.TranslatedText
          })
        }
        return wordsWithTranslation
      })
  }

  lowerCaseFirstLetter (word) {
    // Lowercase first letter to get better results with Google Chrome...
    if (!word.startsWith('I ')) {
      return _.lowerFirst(word)
    }

    return word
  }

  translateWordsGoogle (words) {
    this._cancelablePromise = makeCancelable(this.api.translateWords(words.map(this.lowerCaseFirstLetter)))
    return this._cancelablePromise.promise
      .then((response) => {
        const wordsWithTranslation = []
        const results = eval(response.data)[0] // eslint-disable-line
        for (var i = 0; i < results.length; i++) {
          var res = results[i]
          wordsWithTranslation.push({
            original: words[i],
            translation: res[0][0][0]
          })
        }
        return wordsWithTranslation
      })
  }

  stopPlayback () {
    NavigationActions.lesson({type: 'reset'})
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
    const loopDuration = (originalDuration + translationDuration) * this.props.currentWords.length
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
          <VolumeSlider />
          <View>
            <Text>Speed</Text>
            <Slider
              {...this.props}
              onValueChange={(value) => this.setState({value: value})} />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const lessonHelper = new LessonHelper(state.lesson)
  return {
    volume: state.playback.volume,
    lessonLoopCounter: state.lesson.lessonLoopCounter,
    sameWord: state.lesson.sameWord,
    isPaused: state.playback.isPaused,
    currentWord: state.lesson.words[state.lesson.currentWordId],
    currentWords: lessonHelper.currentWords()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    incCurrentWord: (allowRestart) => dispatch(LessonActions.incCurrentWord(allowRestart)),
    decCurrentWord: () => dispatch(LessonActions.decCurrentWord()),
    setPaused: (val) => dispatch(PlaybackActions.playbackSetPaused(val)),
    loadNextWord: () => dispatch(PlaybackActions.playbackLoadNextWord())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen)
