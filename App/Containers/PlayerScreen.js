// @flow

import React from 'react'
import { View, Text } from 'react-native'
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
    this.props.startLesson()
    // this.props.playerStart()
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

  renderStop () {
    return (
      <View style={styles.stop}>
        <Icon iconStyle={styles.stopIcon} name='keyboard-arrow-up' />
        <Text style={styles.stopText}>STOP</Text>
        <Text style={styles.stopText}>Focus/Good night</Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.mainContainer}>
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
    volume: state.playback.volume
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLesson: () => dispatch(LessonActions.lessonStart()),
    changeVol: (volume) => dispatch(PlaybackActions.playbackVolChange(volume)),
    changeSpeed: (speed) => dispatch(PlaybackActions.playbackSpeedChange(speed))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen)
