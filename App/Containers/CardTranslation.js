// @flow

import React from 'react'
import { View, Text, TouchableWithoutFeedback, TouchableHighlight, Image } from 'react-native'
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
          <TouchableHighlight onPress={() => Player.speakWordInLanguage(this.props.currentWord.translation, 'th-TH', 0.4)}
            underlayColor='#F3F3F3'>
            <View>
              <Text style={styles.title}>{this.props.currentWord.translation}</Text>
              <Text style={styles.title}>{this.props.currentWord.transliteration && this.props.currentWord.transliteration}</Text>
            </View>
          </TouchableHighlight>
          <Image
            // style={}
            source={this.props.currentWord.image}
          />
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
