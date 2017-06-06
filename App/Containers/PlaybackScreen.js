// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import Player from './Player'
import LessonActions from '../Redux/LessonRedux'
import { LESSON_LOOP_MAX } from '../Sagas/PlaybackSagas'
import { Lesson, Card } from '../Realm/realm'

// Styles
import styles from './Styles/PlaybackScreenStyle'

class PlaybackScreen extends React.Component {
  componentWillMount () {
    this.props.startLesson()
  }

  showWord () {
    if (this.props.currentCard) {
      const sentence = this.props.currentCard.fullSentence || this.props.currentCard.sentence
      const sentenceStr = this.props.playingState === 'ORIGINAL' ? sentence.original : sentence.translation
      return <Text>{ sentenceStr }</Text>
    }
  }

  showStatus () {
    if (this.props.currentCard) {
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
  const currentLesson = Lesson.getFromId(state.lesson.currentLessonId)
  return {
    lesson: state.playback.lesson,
    lessonLoopCounter: state.lesson.lessonLoopCounter,
    currentCardIndex: currentLesson.cards.findIndex((c) => c.id === state.lesson.currentCardId),
    isPaused: state.playback.isPaused,
    currentCards: currentLesson.cards,
    currentCard: state.lesson.currentCardId && Card.getFromId(state.lesson.currentCardId),
    playingState: state.playback.playingState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLesson: () => dispatch(LessonActions.lessonStart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackScreen)
