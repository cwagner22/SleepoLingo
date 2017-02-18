// @flow

import React, { PropTypes } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Metrics } from '../Themes'
import FullButton from '../Components/FullButton'

// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'

import API from '../Services/TranslateApi'

// Styles
import styles from './Styles/LessonScreenStyle'

// I18n
import I18n from 'react-native-i18n'

import Reactotron from 'reactotron-react-native'
import FJSON from 'format-json'

import Tts from 'react-native-tts'

// import Tts from 'react-native-tts'

class LessonScreen extends React.Component {
  api: Object

  state: {
    translation: null
  }

  constructor (props: Object) {
    super(props)
    // this.state = {
    //   visibleHeight: Metrics.screenHeight
    // }

    this.api = API.create()

    Tts.setDefaultRate(0.25);
  }

  showResult (response: Object, title: string = 'Response') {
    this.refs.container.scrollTo({x: 0, y: 0, animated: true})
    if (response.ok) {
      this.refs.result.setState({message: FJSON.plain(response.data), title: title})
    } else {
      this.refs.result.setState({message: `${response.problem} - ${response.status}`, title: title})
    }
  }

  speakWordInLanguage (word, language) {
    return new Promise((resolve, reject) => {
      Tts.setDefaultLanguage(language).then(() => {
        Tts.speak(word).then(resolve)
      })
    })
  }

  speakWord (word) {
    return new Promise((resolve, reject) => {
      this.speakWordInLanguage(word.original, 'en-US').then(() => {
        this.speakWordInLanguage(word.translation, 'th-TH').then(() => {
          setTimeout(() => {
            resolve()
          }, 5000)
        })
      })
    })
  }

  translateWord (word) {
    return new Promise((resolve, reject) => {
      this.api.translate(word).then((response) => {
        var translation = eval(response.data)[0][0][0]
        console.log(translation)
        resolve({
          original: word,
          translation
        })
      }, reject)
    })
  }

  speakAllTheWords (results) {
    this.setState({nbLoop: this.state.nbLoop + 1})
    if (this.state.nbLoop < 30) {
      // Sequential promises
      results.reduce((p, r) => p.then(() => this.speakWord(r)), Promise.resolve())
      .then(() => {
        console.log('Repeating');
        setTimeout(() => {
          this.speakAllTheWords(results)
        }, 15000)
      })
    }
  }

  tryEndpoint () {
    // const { label, endpoint, args = [''] } = apiEndpoint
    let toTranslate = ['Welcome', 'Hello', 'How are you?', 'I’m fine', "What's your name?", 'My name is', 'Recommend']
    let translated = []

    const wordPromises = toTranslate.map(this.translateWord.bind(this));

    Promise.all(wordPromises)
      .then((results) => {
        // this.showResult(result, label || `${endpoint}(${args.join(', ')})`)
        // this.setState({ translation })

        // let i = -1
        this.setState({nbLoop: -1})
        this.speakAllTheWords(results)

      })
      .catch(function(err) {
        console.log("Failed:", err);
      });
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
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
