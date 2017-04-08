// @flow

import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'

import LessonActions from '../Redux/LessonRedux'
import Player from '../Services/Player'

// Styles
import styles from './Styles/AnkiScreenStyle'

type CardTranslationProps = {
  // text: string,
  onPress: () => void,
}

class CardTranslation extends React.Component {
  props: CardTranslationProps

  componentWillMount () {
    this.props.showAnswer()
  }

  render () {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={() => this.props.onPress()}>
        <View style={styles.container}>
          <Text onPress={() => Player.speakWordInLanguage(this.props.currentWord.translation, 'th-TH', 0.4)}
            style={styles.title}>{this.props.currentWord.translation}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentWord: state.lesson.currentWord,
    lesson: state.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardTranslation)
