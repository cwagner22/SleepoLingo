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
  lesson1: require('../lesson1.json')
}

class LessonScreen extends React.Component {
  api: Object

  state: {
    translation: null,
    queue: null
  }

  constructor (props: Object) {
    super(props)
    // this.state = {
    //   visibleHeight: Metrics.screenHeight
    // }

    this.api = API.create()

    Tts.setDefaultRate(0.25)
    Tts.addEventListener('tts-start', (event) => console.log('start', event))
    Tts.addEventListener('tts-finish', (event) => {
      console.log('finish', event)

      if (event.utteranceId === this.state.utteranceId) {
        // Finish orig + translation
        var word = this.state.queue.pop()
        this.setState({queue: this.state.queue})
        setTimeout(() => {
          console.log('next')
          this.speakWord(word)
        }, 2000)
      }
    })
    Tts.addEventListener('tts-cancel', (event) => console.log('cancel', event))
  }

  showResult (response: Object, title: string = 'Response') {
    this.refs.container.scrollTo({x: 0, y: 0, animated: true})
    if (response.ok) {
      this.refs.result.setState({message: FJSON.plain(response.data), title: title})
    } else {
      this.refs.result.setState({message: `${response.problem} - ${response.status}`, title: title})
    }
  }

  speakWordInLanguage (word, language, isTranslation) {
    return new Promise((resolve, reject) => {
      Tts.setDefaultLanguage(language)
        .then(() => {
          return Tts.speak(word)
        })
        .then((utteranceId) => {
          if (isTranslation) {
            this.setState({utteranceId})
          }
          resolve()
        })
    })
  }

  speakWord (word) {
    this.speakWordInLanguage(word.original, 'en-US', false)
      .then(() => {
        this.speakWordInLanguage(word.translation, 'th-TH', true)
      })
  }

  translateWord (word) {
    return new Promise((resolve, reject) => {
      this.api.translate(word.orig).then((response) => {
        // var translation = eval(response.data)[0][0][0]
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

  speakAllTheWords (results) {
    this.setState({nbLoop: this.state.nbLoop + 1})
    if (this.state.nbLoop < 30) {
      var self = this

      this.setState({queue: results})
      self.speakWord(results[0])
    }
  }

  tryEndpoint () {
    // let toTranslate = ['Welcome', 'Hello', 'How are you?', 'I’m fine', "What's your name?", 'My name is',
    // 'Recommend']

    const wordPromises = lessons.lesson1.words.map(this.translateWord.bind(this))

    Promise.all(wordPromises)
      .then((results) => {
        console.log(results)
        // this.showResult(result, label || `${endpoint}(${args.join(', ')})`)
        // this.setState({ translation })

        this.setState({nbLoop: -1})
        this.speakAllTheWords(results)
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
