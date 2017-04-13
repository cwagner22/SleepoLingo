// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import Player, { LESSON_LOOP_MAX } from './Player'
import LessonHelper from '../Services/LessonHelper'

// Styles
import styles from './Styles/PlaybackScreenStyle'

class PlaybackScreen extends React.Component {
  componentWillMount () {
    // this.props.init()
  }

  showWord () {
    if (this.props.currentWord) {
      return <Text>{this.props.currentWord.translation}</Text>
    }
  }

  showStatus () {
    if (this.props.currentWord) {
      return (
        <View>
          <Text>{this.props.currentWordIndex + 1} / {this.props.currentWords.length}</Text>
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
  const currentWords = lessonHelper.currentWords()

  return {
    lesson: state.playback.lesson,
    // results: state.playback.results,
    lessonLoopCounter: state.lesson.lessonLoopCounter,
    currentWordIndex: currentWords.findIndex((w) => w.id === state.lesson.currentWordId),
    isPaused: state.playback.isPaused,
    currentWord: state.lesson.words[state.lesson.currentWordId],
    currentWords: currentWords
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // init: () => dispatch(PlaybackActions.playbackInit())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackScreen)
