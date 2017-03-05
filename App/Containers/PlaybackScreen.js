// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import VolumeSlider from '../Components/VolumeSlider'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import API from '../Services/TranslateApi'
import BingAPI from '../Services/BingApi'
import BackgroundTimer from 'react-native-background-timer'

// external libs
// import { Actions as NavigationActions } from 'react-native-router-flux'
import Tts from 'react-native-tts'
import _ from 'lodash'
// import responsiveVoice from '../responsivevoice.src'
import RNFS from 'react-native-fs'
import Sound from 'react-native-sound'
import md5Hex from 'md5-hex'

// Styles
import styles from './Styles/PlaybackScreenStyle'

const nbLoopGlobal = 10
const nbLoopTranslation = 4

const translationTimeout = 5000
const originalTimeout = 1000
const nextWordTimeout = 4000
const repeatAllTimeout = 10000

const rateOriginal = 0.2
const rateTranslation = 0.2 // 0.1 - 0.3

class PlaybackScreen extends React.Component {

  constructor (props: Object) {
    super(props)
    this.api = API.create()
    this.bingAPI = BingAPI.create()
    this.state = {
      // Set your state here
    }

    // Enable playback in silence mode (iOS only)
    Sound.setCategory('Playback', true)

    Tts.addEventListener('tts-start', (event) => console.log('start', event))
    Tts.addEventListener('tts-finish', (event) => {
      console.log('finish', event)
      // Resolve promise
      this.ttsPromise.resolve()
    })
    Tts.addEventListener('tts-cancel', (event) => console.log('cancel', event))
    // Tts.voices().then(voices => console.log(voices))

    this.playLesson()
  }

  playLesson () {
    const words = this.props.lesson.words.map((w) => w.orig)
    this.translateWords(words)
      .then((results) => {
        console.log(results)
        // this.showResult(result, label || `${endpoint}(${args.join(', ')})`)
        // this.setState({ translation })

        this.setState({results: results})
        this.setState({nbLoop: -1})
        this.start()
      })
      .catch(function (err) {
        console.log('Failed:', err)
      })
  }

  getWord () {
    return this.state.currentWordIndex < this.state.results.length ? this.state.results[this.state.currentWordIndex] : null
  }

  start () {
    this.setState({nbLoop: this.state.nbLoop + 1})
    if (this.state.nbLoop < nbLoopGlobal) {
      this.setState({currentWordIndex: 0})
      this.speakWord(this.getWord())
    } else {
      console.log('Finish loop')
    }
  }

  onFinishPlayed () {
    // Finish orig + translation
    this.setState({currentWordIndex: this.state.currentWordIndex + 1})
    const word = this.getWord()

    if (word) {
      // Play next word
      // this.setState({queue: this.state.queue})
      BackgroundTimer.setTimeout(() => {
        console.log('next')
        this.speakWord(word)
      }, nextWordTimeout)
    } else {
      // Restart
      BackgroundTimer.setTimeout(() => {
        console.log('restart')
        this.start()
      }, repeatAllTimeout)
    }
  }

  // showResult (response: Object, title: string = 'Response') {
  //   this.refs.container.scrollTo({x: 0, y: 0, animated: true})
  //   if (response.ok) {
  //     this.refs.result.setState({message: FJSON.plain(response.data), title: title})
  //   } else {
  //     this.refs.result.setState({message: `${response.problem} - ${response.status}`, title: title})
  //   }
  // }

  playFile (fileName, resolve, reject) {
    var whoosh = new Sound('cache/' + fileName, Sound.DOCUMENT, (error) => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels())

      // Play the sound with an onEnd callback
      whoosh
        .setVolume(this.refs.volumeSlider.state.value)
        .play((success) => {
          if (success) {
            console.log('successfully finished playing')
            resolve()
          } else {
            console.log('playback failed due to audio decoding errors')
            reject()
          }
        })
    })
  }

  speakWordInLanguage (word, language, rate) {
    return new Promise((resolve, reject) => {
      var deviceTTS = false
      if (deviceTTS) {
        Tts.setDefaultRate(rate)
          .then(() => Tts.setDefaultLanguage(language))
          .then(() => {
            // Will be resolved once plaback finished
            this.ttsPromise = {resolve, reject}
            Tts.speak(word)
          })
      } else {
        const fileName = md5Hex(word) + '.mp3'

        // or DocumentDirectoryPath for android
        var path = RNFS.DocumentDirectoryPath + '/cache/' + fileName
        const url = this.api.ttsURL(word, language, rate)

        RNFS.exists(path)
          .then((exists) => {
            if (!exists) {
              // write the file
              RNFS.downloadFile({fromUrl: url, toFile: path}).promise
                .then((success) => {
                  console.log('FILE WRITTEN!', url, path)
                  this.playFile(fileName, resolve, reject)
                })
                .catch((err) => {
                  console.log(err.message)
                })
            } else {
              this.playFile(fileName, resolve, reject)
            }
          })
      }
    })
  }

  speakOriginal (word) {
    return new Promise((resolve, reject) => {
      this.speakWordInLanguage(word, 'en-US', rateOriginal).then(
        () => BackgroundTimer.setTimeout(resolve, originalTimeout))
    })
  }

  // _speakTranslationWithTimeout (word) {
  //   return new Promise((resolve, reject) => {
  //     this.speakWordInLanguage(word, 'th-TH', 0.15).then(() => BackgroundTimer.setTimeout(resolve, 2000))
  //   })
  // }

  speakTranslation (word) {
    // return new Promise((resolve, reject) => {
    //   this._speakTranslationWithTimeout(word)
    //     .then(() => this._speakTranslationWithTimeout(word))
    //     .then(() => this._speakTranslationWithTimeout(word))
    //     .then(resolve)
    // })

    this.nbTranslation++

    return new Promise((resolve, reject) => {
      this.speakWordInLanguage(word, 'th-TH', rateTranslation)
        .then(() => {
          // Repeat translation 3 times
          if (this.nbTranslation < nbLoopTranslation) {
            BackgroundTimer.setTimeout(() => this.speakTranslation(word).then(resolve), translationTimeout)
          } else {
            resolve()
          }
        })
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

  // translateWord (word) {
  //   return new Promise((resolve, reject) => {
  //     this.api.translate(word).then((response) => {
  //       var json = response.data
  //       var translation = json.sentences[0].trans
  //       console.log(translation)
  //       resolve({
  //         original: word.orig,
  //         translation
  //       })
  //     }, reject)
  //   })
  // }

  translateWords (words) {
    return new Promise((resolve, reject) => {
      this.bingAPI.translateArray(words).then((response) => {
        const wordsWithTranslation = []
        const results = response.data
        for (var i = 0; i < results.length; i++) {
          var res = results[i]
          wordsWithTranslation.push({
            original: words[i],
            translation: res.TranslatedText
          })
        }
        resolve(wordsWithTranslation)
      }, reject)
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
    return new Promise((resolve, reject) => {
      this.api.translateWords(words.map(this.lowerCaseFirstLetter)).then((response) => {
        const wordsWithTranslation = []
        const results = eval(response.data)[0] // eslint-disable-line
        for (var i = 0; i < results.length; i++) {
          var res = results[i]
          wordsWithTranslation.push({
            original: words[i],
            translation: res[0][0][0]
          })
        }
        resolve(wordsWithTranslation)
      }, reject)
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
      const originalDuration = wordDuration + originalTimeout
      const translationDuration = (wordDuration + translationTimeout) * nbLoopTranslation + nextWordTimeout
      const loopDuration = (originalDuration + translationDuration) * this.state.results.length
      const totalDuration = (loopDuration + repeatAllTimeout) * nbLoopGlobal

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
        <View>
          {this.renderTime()}
          <VolumeSlider ref='volumeSlider' />
        </View>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    lesson: state.lesson.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
  // return bindActionCreators({selectUser: selectUser}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackScreen)
