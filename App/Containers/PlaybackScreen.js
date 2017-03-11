// @flow

import React from 'react'
import { View, ScrollView, Text, Slider, TouchableOpacity } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import VolumeSlider from './VolumeSlider'

import API from '../Services/TranslateApi'
import BingAPI from '../Services/BingApi'
import loadSound from '../Services/Sound'
import makeCancelable from '../Lib/MakeCancelable'
import Deferred from '../Lib/Deferred'

// external libs
import Tts from 'react-native-tts'
import _ from 'lodash'
import RNFS from 'react-native-fs'
import Sound from 'react-native-sound'
import md5Hex from 'md5-hex'
import BackgroundTimer from 'react-native-background-timer'

// Styles
import styles from './Styles/PlaybackScreenStyle'

const nbLoopGlobal = 3
const nbLoopTranslation = 3

class PlaybackScreen extends React.Component {
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
          console.log(err.stack)
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

    const x = this.state.nbLoop
    const startX = 0
    const endX = nbLoopGlobal - 1

    this.volume = this.linearOffsetFn(x, startX, endX, 1, 0.4)

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
    const rateEnd = 0.2
    this.rateOriginal = this.linearOffsetFn(x, startX, endX, rateStart, rateEnd)
    this.rateTranslation = this.linearOffsetFn(x, startX, endX, rateStart, rateEnd)
  }

  playLesson () {
    const words = this.props.lesson.words.map((w) => w.orig)
    this.translateWordsGoogle(words)
      .then((results) => {
        console.log(results)
        this.setState({
          results: results,
          nbLoop: -1
        })
        this.start()
      })
      .catch(function (err) {
        console.log('Failed:', err.stack)
      })
  }

  getWord () {
    return this.state.currentWordIndex < this.state.results.length ? this.state.results[this.state.currentWordIndex] : null
  }

  start () {
    this.setState({
      nbLoop: this.state.nbLoop + 1,
      currentWordIndex: 0
    })

    this.setModifiers()
    this.speakWord(this.getWord())
  }

  restart () {
    if (this.state.nbLoop < nbLoopGlobal) {
      this.speakOriginal('Restarting the lesson')
        .then(() => this.start())
    }
  }

  onFinishPlayed () {
    // Finish orig + translation
    this.setState({currentWordIndex: this.state.currentWordIndex + 1})
    const word = this.getWord()

    if (word) {
      // Play next word
      this.delay(this.nextWordTimeout).then(() => this.speakWord(word))
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
        if (this.nbTranslation < nbLoopTranslation) {
          return this.delay(this.translationTimeout)
            .then(() => this.speakTranslation(word))
        }
      })
  }

  speakWord (word) {
    this.setState({currentWord: word})
    console.log(word)
    if (!word.translation) {
      return this.onFinishPlayed()
    }

    this.nbTranslation = 0
    this.speakOriginal(word.original)
      .then(() => this.speakTranslation(word.translation))
      .then(() => this.onFinishPlayed())
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

  showWord () {
    if (!this.isPlaying()) {
      return
    }

    return <Text>{this.state.currentWord.translation}</Text>
  }

  showStatus () {
    if (!this.isPlaying()) {
      return
    }

    return (
      <View>
        <Text>{this.state.currentWordIndex + 1} / {this.props.lesson.words.length}</Text>
        <Text>{this.state.nbLoop + 1} / {nbLoopGlobal}</Text>
      </View>
    )
  }

  isPlaying () {
    return !!this.state.currentWord
  }

  stopPlayback () {
    NavigationActions.lesson({ type: 'replace' })
  }

  resumePlayback () {
    this.setState({isPaused: false})
    // Restart word playback from original
    this.speakWord(this.getWord())
  }

  pausePlayback () {
    this.cancelPromises()
    this.setState({isPaused: true})
  }

  previous () {
    this.cancelPromises()
    this.setState({
      currentWordIndex: Math.max(0, this.state.currentWordIndex - 1)
    }, () => this.speakWord(this.getWord()))
  }

  next () {
    this.cancelPromises()
    this.setState({
      currentWordIndex: Math.min(this.state.results.length - 1, this.state.currentWordIndex + 1)
    }, () => this.speakWord(this.getWord()))
  }

  renderPlayPauseButton () {
    if (this.state.isPaused) {
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
    if (this.isPlaying()) {
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
    if (this.state.results) {
      const wordDuration = 2000 // Average time to load one file + play
      const repeatingSentenceDuration = 2000 // Average time to play repeating sentence
      const originalDuration = wordDuration + this.originalTimeout
      const translationDuration = (wordDuration + this.translationTimeout) * nbLoopTranslation + this.nextWordTimeout
      const loopDuration = (originalDuration + translationDuration) * this.state.results.length
      const totalDuration = (loopDuration + this.repeatAllTimeout + repeatingSentenceDuration + this.originalTimeout) *
        (nbLoopGlobal - 1) + loopDuration

      return (
        <View>
          <Text>~ Loop Duration: {this.durationStr(loopDuration)}</Text>
          <Text>~ Total Duration: {this.durationStr(totalDuration)}</Text>
        </View>
      )
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          {this.showWord()}
          {this.showStatus()}
        </ScrollView>
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
    lesson: state.lesson.lesson,
    volume: state.playback.volume
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackScreen)
