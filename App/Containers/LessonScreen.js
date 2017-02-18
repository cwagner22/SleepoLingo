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
  }

  showResult (response: Object, title: string = 'Response') {
    this.refs.container.scrollTo({x: 0, y: 0, animated: true})
    if (response.ok) {
      this.refs.result.setState({message: FJSON.plain(response.data), title: title})
    } else {
      this.refs.result.setState({message: `${response.problem} - ${response.status}`, title: title})
    }
  }

  tryEndpoint () {
    // const { label, endpoint, args = [''] } = apiEndpoint
    this.api.translate('Hello').then((response) => {
      var translation = eval(response.data)[0][0][0]
      Reactotron.log(translation)
      this.setState({ translation })
      // this.showResult(result, label || `${endpoint}(${args.join(', ')})`)

      Tts.speak(translation);
      Tts.voices().then(voices => Reactotron.log(voices))
    })
  }

  renderButton () {
    return (
      <FullButton text='Test' onPress={this.tryEndpoint.bind(this)} styles={{marginTop: 10}} />
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
