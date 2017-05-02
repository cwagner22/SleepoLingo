// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import Player from './Player'
import LessonHelper from '../Services/LessonHelper'
import CardHelper from '../Services/CardHelper'
import LessonActions, { LESSON_LOOP_MAX } from '../Redux/LessonRedux'

// Styles
import styles from './Styles/PlaybackScreenStyle'

class PlaybackScreen extends React.Component {
  componentWillMount () {
    this.props.startLesson()
  }

  showWord () {
    if (this.props.currentWord) {
      const sentence = this.props.currentCards.fullSentence ? this.props.currentCards.fullSentence.translation
        : this.props.currentCards.sentence.translation
      return <Text>{ sentence.translation}</Text>
    }
  }

  showStatus () {
    if (this.props.currentWord) {
      return (
        <View>
          <Text>{this.props.currentCardIndex + 1} / {this.props.currentCards.length}</Text>
          <Text>{this.props.lessonLoopCounter} / {LESSON_LOOP_MAX}</Text>
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
        <Player />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const lessonHelper = new LessonHelper(state.lesson)
  const cardHelper = new CardHelper(state.lesson)
  const currentCards = lessonHelper.currentCards()

  return {
    lesson: state.playback.lesson,
    lessonLoopCounter: state.lesson.lessonLoopCounter,
    currentCardIndex: currentCards.findIndex((c) => c.id === state.lesson.currentCardId),
    isPaused: state.playback.isPaused,
    currentCards,
    currentCard: cardHelper.currentCard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLesson: () => dispatch(LessonActions.lessonStart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackScreen)
