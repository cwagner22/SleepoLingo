// @flow

import React from 'react'
import { View, Text, Slider, TouchableOpacity } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import VolumeSlider from './VolumeSlider'
import API from '../Services/TranslateApi'
import BingAPI from '../Services/BingApi'
import loadSound from '../Services/Sound'
import makeCancelable from '../Lib/MakeCancelable'
import Deferred from '../Lib/Deferred'
import PlaybackActions from '../Redux/PlaybackRedux'

// external libs
import Tts from 'react-native-tts'
import _ from 'lodash'
import RNFS from 'react-native-fs'
import Sound from 'react-native-sound'
import md5Hex from 'md5-hex'
import BackgroundTimer from 'react-native-background-timer'

// Styles
// import styles from './Styles/PlayerStyle'

export const LESSON_LOOP_MAX = 3
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

    this.playLesson()
  }

  componentWillUnmount () {
    this.cancelPromises()
    this.props.setPaused(true)
  }

  cancelPromises () {
    this._sound && this._sound.cancel()
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

    // const x = this.props.lessonLoopIndex
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

  playLesson () {
    // const words = this.props.lesson.words.map((w) => w.orig)
    // this.translateWordsGoogle(words)
    //   .then((results) => {
    //     console.log(results)
    //     this.props.setResults(results)
    //     // this.props.setLessonLoop(-1)
    //
    //     this.start()
    //   })
    //   .catch(function (err) {
    //     if (!err.isCanceled) {
    //       console.log(err && err.stack)
    //     }
    //   })

    this.start()
  }

  getWord () {
    return this.props.currentWordIndex < this.props.lesson.words.length ? this.props.lesson.words[this.props.currentWordIndex] : null
  }

  start () {
    this.props.setCurrentWord(0)
    this.props.incLessonLoop()

    setTimeout(() => {
      this.setModifiers()
      this.props.setPaused(false)
      this.speakWord()
    }) // fix fucking redux/setState async update issue
  }

  restart () {
    if (this.props.lessonLoopIndex < LESSON_LOOP_MAX) {
      this.speakOriginal('Restarting the lesson')
        .then(() => this.start())
    }
  }

  onFinishPlayed () {
    // Finish orig + translation
    if (this.props.currentWordIndex < this.props.lesson.words.length - 1) {
      // Play next word
      this.props.incCurrentWord()
      this.delay(this.nextWordTimeout).then(() => this.speakWord())
    } else {
      // Restart
      this.delay(this.repeatAllTimeout).then(() => this.restart())
    }
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

  downloadAudioIfNeeded (word, language, rate) {
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

    return this.makeCancelable(promise)
  }

  speakWordInLanguage (word, language, rate) {
    var deviceTTS = false
    if (deviceTTS) {
      return this.playTTS()
    } else {
      return this.downloadAudioIfNeeded(word, language, rate)
        .then((fileName) => {
          this._sound = loadSound(fileName, this.volume * this.props.volume)
          return this._sound.promise
        })
    }
  }

  speakOriginal (word) {
    return this.speakWordInLanguage(word, 'en-US', this.rateOriginal)
      .then(() => {
        return this.delay(this.originalTimeout)
      })
  }

  speakTranslation (word) {
    this.nbTranslation++

    return this.speakWordInLanguage(word, 'th-TH', this.rateTranslation)
      .then(() => {
        // Repeat translation 3 times
        if (this.nbTranslation < TRANSLATION_LOOP_MAX) {
          return this.delay(this.translationTimeout)
            .then(() => this.speakTranslation(word))
        }
      })
  }

  speakWord () {
    var word = this.getWord()
    // this.setState({currentWord: word})
    console.log(word)
    console.log(this.props.lesson)
    if (!word.translation) {
      return this.onFinishPlayed()
    }

    this.nbTranslation = 0
    this.speakOriginal(word.original)
      .then(() => this.speakTranslation(word.translation))
      .then(() => this.onFinishPlayed())
      .catch(function (err) {
        if (!err.isCanceled) {
          console.log(err && err.stack)
        }
      })
  }

  translateWords (words) {
    this._cancelablePromise = makeCancelable(this.bingAPI.translateArray(words))
    return this._cancelablePromise.promise
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
    setTimeout(() => this.speakWord()) // fix fucking redux/setState async update issue
  }

  next () {
    this.cancelPromises()
    this.props.incCurrentWord()
    setTimeout(() => this.speakWord()) // fix fucking redux/setState async update issue
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
    const loopDuration = (originalDuration + translationDuration) * this.props.lesson.words.length
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
  return {
    lesson: state.playback.lesson,
    volume: state.playback.volume,
    results: state.playback.results,
    lessonLoopIndex: state.playback.lessonLoopIndex,
    currentWordIndex: state.playback.currentWordIndex,
    isPaused: state.playback.isPaused
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    incLessonLoop: () => dispatch(PlaybackActions.incLessonLoop()),
    decLessonLoop: () => dispatch(PlaybackActions.decLessonLoop()),
    setLessonLoop: (val) => dispatch(PlaybackActions.setLessonLoop(val)),
    incCurrentWord: () => dispatch(PlaybackActions.incCurrentWord()),
    decCurrentWord: () => dispatch(PlaybackActions.decCurrentWord()),
    setCurrentWord: (val) => dispatch(PlaybackActions.setCurrentWord(val)),
    setResults: (res) => dispatch(PlaybackActions.playbackResults(res)),
    setPaused: (val) => dispatch(PlaybackActions.playbackSetPaused(val))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen)
