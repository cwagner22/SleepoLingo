// @flow

import React, { PropTypes } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import BackgroundTimer from 'react-native-background-timer'
import { Icon } from 'react-native-elements'

import PlaybackActions from '../Redux/PlaybackRedux'
import LessonActions from '../Redux/LessonRedux'
import NavigationActions from '../Navigation/NavigationActions'

// Styles
import styles from './Styles/PlayerControlsStyle'

class PlayerControls extends React.Component {
  static propTypes = {
    openSettings: PropTypes.func
  }

  componentWillMount () {
    // this.scheduleTimer()
  }

  scheduleTimer () {
    BackgroundTimer.setTimeout(() => {
      // Force component to stop right now. Pop() will be called once the app is active.
      this.componentWillUnmount()
      this.props.navigation.back()
    }, 60 * 60 * 1000)
  }

  renderPlayPauseButton () {
    if (this.props.isPaused) {
      return (
        <TouchableOpacity onPress={this.props.playerResume} style={styles.button}>
          <Icon iconStyle={styles.buttonIcon} name='play-arrow' size={35} />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={this.props.playerPause} style={styles.button}>
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
        <TouchableOpacity onPress={this.props.goToSettings} style={styles.settingsButton}>
          <Icon size={20} name='settings' color='white' />
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
  return {
    isPaused: state.playback.isPaused,
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
    playerStart: () => dispatch(PlaybackActions.playerStart()),
    playerNext: () => dispatch(PlaybackActions.playerNext()),
    playerPrev: () => dispatch(PlaybackActions.playerPrev()),
    playerPause: () => dispatch(PlaybackActions.playerPause()),
    playerResume: () => dispatch(PlaybackActions.playerResume()),
    changeSpeed: () => dispatch(PlaybackActions.playbackSpeedChange()),
    goToSettings: (lessonId) => dispatch(NavigationActions.navigate('PlayerSettingsScreen'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerControls)
