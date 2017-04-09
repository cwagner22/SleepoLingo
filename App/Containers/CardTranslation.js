// @flow

import React from 'react'
import { View, TouchableWithoutFeedback, Image } from 'react-native'
import { connect } from 'react-redux'

import LessonActions from '../Redux/LessonRedux'
import Player from '../Services/Player'
import TranslationText from '../Components/TranslationText'

// Styles
import styles from './Styles/AnkiScreenStyle'

class CardTranslation extends React.Component {
  componentWillMount () {
    this.props.showAnswer()
  }

  speakText (text) {
    Player.speakWordInLanguage(text, 'th-TH', 0.4)
  }

  renderFullTranslation () {
    if (this.props.currentWord.full) {
      return (
        <TranslationText translation={this.props.currentWord.full.translation}
          transliteration={this.props.currentWord.full.transliteration}
          onPress={() => this.speakText(this.props.currentWord.full.translation)} />
      )
    }
  }

  render () {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={() => this.props.onPress()}>
        <View style={styles.container}>
          <TranslationText translation={this.props.currentWord.translation}
            transliteration={this.props.currentWord.transliteration}
            onPress={() => this.speakText(this.props.currentWord.translation)} />
          {this.renderFullTranslation()}
          <Image
            style={{flex: 1, height: undefined, width: undefined}} resizeMode='contain'
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
