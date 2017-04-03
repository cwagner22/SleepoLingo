// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import Player, { LESSON_LOOP_MAX } from './Player'

// Styles
import styles from './Styles/PlaybackScreenStyle'

class PlaybackScreen extends React.Component {
  currentWord () {
    return this.props.lesson.words[this.props.currentWordIndex]
  }

  showWord () {
    if (!this.props.isPaused) {
      return <Text>{this.currentWord().translation}</Text>
    }
  }

  showStatus () {
    if (!this.props.isPaused) {
      return (
        <View>
          <Text>{this.props.currentWordIndex + 1} / {this.props.lesson.words.length}</Text>
          <Text>{this.props.lessonLoopIndex + 1} / {LESSON_LOOP_MAX}</Text>
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
  return {
    lesson: state.playback.lesson,
    // results: state.playback.results,
    lessonLoopIndex: state.playback.lessonLoopIndex,
    currentWordIndex: state.playback.currentWordIndex,
    isPaused: state.playback.isPaused
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackScreen)
