// @flow

import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import LessonActions from '../Redux/LessonRedux'
import CardOriginal from './CardOriginal'
import CardTranslation from './CardTranslation'
import AnkiFooter from './AnkiFooter'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  componentWillMount () {
    this.props.loadNextCard()
  }

  renderOriginal () {
    if (this.props.lesson.showFront) {
      return (
        <CardOriginal text={this.props.lesson.currentWord.original}
          fullText={this.props.lesson.currentWord.full && this.props.lesson.currentWord.full.original}
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
    if (!this.props.lesson.currentWord) {
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
  return {
    lesson: state.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    showFront: () => dispatch(LessonActions.lessonShowFront()),
    showBack: () => dispatch(LessonActions.lessonShowBack()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
