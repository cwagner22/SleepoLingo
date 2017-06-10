// @flow

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import BackgroundTimer from 'react-native-background-timer'
import { Icon } from 'react-native-elements'

import PlaybackActions from '../Redux/PlaybackRedux'
import LessonActions from '../Redux/LessonRedux'
// import { LESSON_LOOP_MAX } from '../Sagas/PlaybackSagas'
import { Lesson, Card } from '../Realm/realm'

// Styles
import styles from './Styles/PlayerControlsStyle'

class PlayerControls extends React.Component {
  componentWillMount () {
    // this.props.playerStart()
    // this.scheduleTimer()
  }

  // componentWillUnmount () {
  //   this.props.playerStop()
  // }

  scheduleTimer () {
    BackgroundTimer.setTimeout(() => {
      // Force component to stop right now. Pop() will be called once the app is active.
      this.componentWillUnmount()
      this.props.navigation.back()
    }, 60 * 60 * 1000)
  }

  stopPlayback () {
    // todo: crashes for no reason
    this.props.navigation.back()
    // NavigationActions.lesson(this.props.currentLessonId)
  }

  resumePlayback () {
    this.props.setPaused(false)
    // Restart word playback from original
    this.speakWord()
  }

  pausePlayback () {
    this.cancelPromises()
    this.props.setPaused(true)
  }

  renderPlayPauseButton () {
    if (this.props.isPaused) {
      return (
        <TouchableOpacity onPress={this.resumePlayback.bind(this)} style={styles.button}>
          <Icon iconStyle={styles.buttonIcon} name='play-arrow' size={35} />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={this.pausePlayback.bind(this)} style={styles.button}>
          <Icon iconStyle={styles.buttonIcon} name='pause' size={35} />
        </TouchableOpacity>
      )
    }
  }

  renderPlaybackButtons () {
    return (
      <View style={styles.btns}>
        <TouchableOpacity onPress={this.props.changeSpeed} style={styles.speedButton}>
          <Text style={{color: 'white'}}>{this.props.speed}</Text>
          <Icon size={16} name='close' color='white' />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.playerPrev} style={styles.button}>
          <Icon iconStyle={styles.buttonIcon} name='skip-previous' size={35} />
        </TouchableOpacity>
        {this.renderPlayPauseButton()}
        <TouchableOpacity onPress={this.props.playerNext} style={styles.button}>
          <Icon iconStyle={styles.buttonIcon} name='skip-next' size={35} />
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.btnsContainer}>
        {this.renderPlaybackButtons()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const currentLesson = Lesson.getFromId(state.lesson.currentLessonId)

  return {
    lessonLoopCounter: state.lesson.lessonLoopCounter,
    translationLoopCounter: state.lesson.translationLoopCounter,
    playingState: state.lesson.playingState,
    sameWord: state.lesson.sameWord,
    isPaused: state.playback.isPaused,
    playback: state.playback,
    currentCard: state.lesson.currentCardId && Card.getFromId(state.lesson.currentCardId),
    currentCards: currentLesson.cards,
    speed: state.playback.speed
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    incCurrentWord: (allowRestart) => dispatch(LessonActions.incCurrentWord(allowRestart)),
    decCurrentWord: () => dispatch(LessonActions.decCurrentWord()),
    play: (sentence, language, volume, speed) => dispatch(
      PlaybackActions.playbackStart(sentence, language, volume, speed)),
    loadPlayingState: () => dispatch(LessonActions.loadPlayingState()),
    // playerStart: () => dispatch(PlaybackActions.playerStart()),
    playerNext: () => dispatch(PlaybackActions.playerNext()),
    playerPrev: () => dispatch(PlaybackActions.playerPrev()),
    changeSpeed: () => dispatch(PlaybackActions.playbackSpeedChange())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerControls)
