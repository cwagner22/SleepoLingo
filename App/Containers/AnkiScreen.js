// @flow

import React from 'react'
import { View, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import LessonActions from '../Redux/LessonRedux'
import CardOriginal from './CardOriginal'
import CardTranslation from './CardTranslation'
import AnkiFooter from './AnkiFooter'
import WordHelper from '../Services/WordHelper'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  componentWillMount () {
    this.props.startLesson()
    this.props.loadNextCard()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentWord !== this.props.currentWord && !nextProps.currentWord) {
      Alert.alert(
        'Well done',
        'No more cards, come back later!',
        [
          {text: 'OK', onPress: () => NavigationActions.lessonsList({type: 'reset'})}
        ]
      )
    }
  }

  renderOriginal () {
    if (this.props.lesson.showFront) {
      return (
        <CardOriginal text={this.props.currentWord.original}
          fullText={this.props.currentWord.full && this.props.currentWord.full.original}
          onPress={() => { this.props.showBack() }} />
      )
    }
  }

  renderTranslation () {
    if (!this.props.lesson.showFront) {
      return (
        <CardTranslation onPress={() => { this.props.showFront() }} />
      )
    }
  }

  renderFooter () {
    if (this.props.lesson.showAnswer) {
      return (
        <AnkiFooter />
      )
    }
  }

  render () {
    if (!this.props.currentWord) {
      return null
    }

    return (
      <View style={styles.mainContainer}>
        {this.renderOriginal()}
        {this.renderTranslation()}
        {this.renderFooter()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const wordHelper = new WordHelper(state.lesson)

  return {
    lesson: state.lesson,
    currentWord: wordHelper.currentWord
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    showFront: () => dispatch(LessonActions.lessonShowFront()),
    showBack: () => dispatch(LessonActions.lessonShowBack()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard()),
    startLesson: () => dispatch(LessonActions.lessonStart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
