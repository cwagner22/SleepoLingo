// @flow

import React from 'react'
import { View, Text, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'

import PlaybackControls from './PlayerControls'
import PlayerProgress from './PlayerProgress'
import LessonActions from '../Redux/LessonRedux'
import { Lesson, Card } from '../Realm/realm'
import VolumeSlider from '../Components/VolumeSlider'
import PlaybackActions from '../Redux/PlaybackRedux'

// Styles
import styles from './Styles/PlayerScreenStyle'

class PlayerScreen extends React.Component {
  componentWillMount () {
    StatusBar.setBarStyle('light-content')
    this.props.startLesson()
    this.props.playerStart()
  }

  componentWillUnmount () {
    this.props.playerStop()
  }

  renderWord () {
    if (this.props.currentCard) {
      const sentence = this.props.currentCard.fullSentence || this.props.currentCard.sentence
      const sentenceStr = this.props.playingState === 'ORIGINAL' ? sentence.original : sentence.translation
      return (
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentence}>{ sentenceStr }</Text>
        </View>
      )
    }
  }

  renderInfoText () {
    const text = this.props.lessonLoopCounter === 0 ? 'Focus on the audio lesson until the end'
      : 'Good night. Playing the lesson one more time so you listen while drifting off'

    return (
      <Text style={styles.infoText}>{text}</Text>
    )
  }

  renderStop () {
    return (
      <View style={styles.stop}>
        <Icon iconStyle={styles.stopIcon} name='keyboard-arrow-up' />
        <Text style={styles.stopText}>STOP</Text>
        { this.renderInfoText() }
      </View>
    )
  }

  render () {
    const bgStyle = {
      backgroundColor: this.props.lessonLoopCounter === 0 ? '#0e1a29'
        : '#0c0f1c'
    }

    return (
      <View style={[styles.mainContainer, bgStyle]}>
        {this.renderWord()}
        {this.renderStop()}
        <VolumeSlider volume={this.props.volume} onChange={(volume) => this.props.changeVol(volume)} />
        <PlayerProgress />
        <PlaybackControls />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const currentLesson = Lesson.getFromId(state.lesson.currentLessonId)
  return {
    isPaused: state.playback.isPaused,
    currentCards: currentLesson.cards,
    currentCard: state.lesson.currentCardId && Card.getFromId(state.lesson.currentCardId),
    playingState: state.playback.playingState,
    volume: state.playback.volume,
    lessonLoopCounter: state.lesson.lessonLoopCounter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLesson: () => dispatch(LessonActions.lessonStart()),
    changeVol: (volume) => dispatch(PlaybackActions.playbackVolChange(volume)),
    changeSpeed: (speed) => dispatch(PlaybackActions.playbackSpeedChange(speed)),
    playerStart: () => dispatch(PlaybackActions.playerStart()),
    playerStop: () => dispatch(PlaybackActions.playerStop())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen)