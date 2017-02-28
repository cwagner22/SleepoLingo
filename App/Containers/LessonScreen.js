// @flow

import React, { PropTypes } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import FullButton from '../Components/FullButton'

import API from '../Services/TranslateApi'

// Styles
import styles from './Styles/LessonScreenStyle'

import FJSON from 'format-json'

import Tts from 'react-native-tts'

const lessons = {
  lesson1: require('../lesson1.json'),
  lesson2: require('../lesson2.json'),
  lesson3: require('../lesson3.json')
}

class LessonScreen extends React.Component {
  api: Object

  state: {
    translation: null,
    results: null
  }

  constructor (props: Object) {
    super(props)
    // this.state = {
    //   visibleHeight: Metrics.screenHeight
    // }

    this.api = API.create()

    Tts.addEventListener('tts-start', (event) => console.log('start', event))
    Tts.addEventListener('tts-finish', (event) => {
      console.log('finish', event)
      // Resolve promise
      this.ttsPromise.resolve()
    })
    Tts.addEventListener('tts-cancel', (event) => console.log('cancel', event))
  }

  getWord () {
    return this.state.currentWordIndex < this.state.results.length ? this.state.results[this.state.currentWordIndex] : null
  }

  start () {
    this.setState({nbLoop: this.state.nbLoop + 1})
    if (this.state.nbLoop < 30) {
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
      setTimeout(() => {
        console.log('next')
        this.speakWord(word)
      }, 1000)
    } else {
      // Restart
      setTimeout(() => {
        console.log('restart')
        this.start()
      }, 4000)
    }
  }

  showResult (response: Object, title: string = 'Response') {
    this.refs.container.scrollTo({x: 0, y: 0, animated: true})
    if (response.ok) {
      this.refs.result.setState({message: FJSON.plain(response.data), title: title})
    } else {
      this.refs.result.setState({message: `${response.problem} - ${response.status}`, title: title})
    }
  }

  speakWordInLanguage (word, language, rate) {
    return new Promise((resolve, reject) => {
      Tts.setDefaultRate(rate)
        .then(() => Tts.setDefaultLanguage(language))
        .then(() => {
          // Will be resolved once plaback finished
          this.ttsPromise = {resolve, reject}
          Tts.speak(word)
        })
    })
  }

  speakOriginal (word) {
    return this.speakWordInLanguage(word, 'en-US', 0.3) // 0.3 - 0.35
  }

  speakTranslation (word) {
    this.nbTranslation++

    return new Promise((resolve, reject) => {
      this.speakWordInLanguage(word, 'th-TH', 0.1) // 0.1 - 0.3
        .then(() => {
          // Repeat translation 3 times
          if (this.nbTranslation < 3) {
            setTimeout(() => this.speakTranslation(word).then(resolve), 2000)
          } else {
            resolve()
          }
        })
    })
  }

  speakWord (word) {
    console.log(word)
    if (!word.translation) {
      return this.onFinishPlayed()
    }

    this.nbTranslation = 0
    this.speakOriginal(word.original)
      .then(() => this.speakTranslation(word.translation))
      .then(() => this.onFinishPlayed())
  }

  translateWord (word) {
    return new Promise((resolve, reject) => {
      this.api.translate(word).then((response) => {
        var json = response.data
        var translation = json.sentences[0].trans
        console.log(translation)
        resolve({
          original: word.orig,
          translation
        })
      }, reject)
    })
  }

  translateWords (words) {
    return new Promise((resolve, reject) => {
      this.api.translateWords(words).then((response) => {
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

  tryEndpoint () {
    // let toTranslate = ['Welcome', 'Hello', 'How are you?', 'I’m fine', "What's your name?", 'My name is',
    // 'Recommend']

    // const wordPromises = lessons.lesson2.words.map(this.translateWord.bind(this))

    const words = lessons.lesson3.words.map((w) => w.orig)
    this.translateWords(words)
    // Promise.all(wordPromises)
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

  renderButton () {
    return (
      <FullButton text='Test' onPress={this.tryEndpoint.bind(this)} styles={{marginTop: 100}} />
    )
  }

  render () {
    // const { translation } = this.props

    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <Text>LessonScreen Container</Text>
        </KeyboardAvoidingView>
        {this.renderButton()}
        <Text>{this.props.translation}</Text>
      </ScrollView>
    )
  }

}

LessonScreen.propTypes = {
  translation: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    translation: state.translation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
