// @flow

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import Sound from 'react-native-sound'
import BackgroundTimer from 'react-native-background-timer'

import VolumeSlider from '../Components/VolumeSlider'
import SpeedSlider from '../Components/SpeedSlider'
import API from '../Services/TranslateApi'
import PlaybackActions from '../Redux/PlaybackRedux'
import LessonActions, { LESSON_LOOP_MAX } from '../Redux/LessonRedux'
import LessonHelper from '../Services/LessonHelper'
import CardHelper from '../Services/CardHelper'

// Styles
// import styles from './Styles/PlayerStyle'

const TRANSLATION_LOOP_MAX = 3

class PlayerScreen extends React.Component {
  constructor (props: Object) {
    super(props)
    this.api = API.create()
    this.state = {
      // Set your state here
    }
    this._cancelablePromise = null
    this._ttsDeferred = null

    // Enable playback in silence mode (iOS only)
    Sound.setCategory('Playback', true)

    this.scheduleTimer()

    this.props.playerStart()
  }

  scheduleTimer () {
    BackgroundTimer.setTimeout(() => {
      // Force component to stop right now. Pop() will be called once the app is active.
      this.componentWillUnmount()
      this.props.navigation.back()
    }, 60 * 60 * 1000)
  }

  componentWillUnmount () {
    this.props.playerStop()
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
        <View>
          <TouchableOpacity onPress={this.resumePlayback.bind(this)}>
            <Text>RES</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View>
          <TouchableOpacity onPress={this.pausePlayback.bind(this)}>
            <Text>PAUSE</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderPlaybackButtons () {
    return (
      <View>
        <View>
          <TouchableOpacity onPress={this.props.playerPrev}>
            <Text>PREV</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.stopPlayback.bind(this)}>
            <Text>STOP</Text>
          </TouchableOpacity>
        </View>
        {this.renderPlayPauseButton()}
        <View>
          <TouchableOpacity onPress={this.props.playerNext}>
            <Text>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  durationStr (ms) {
    var hours = Math.floor(ms / 1000 / 3600)
    var mins = Math.round(ms / 1000 / 60 - (hours * 60))
    var str = ''
    if (hours) {
      str += hours + 'h '
    }

    str += mins + 'mins'
    return str
  }

  renderTime () {
    const wordDuration = 2000 // Average time to load one file + play
    const repeatingSentenceDuration = 2000 // Average time to play repeating sentence
    const originalDuration = wordDuration + this.originalTimeout
    const translationDuration = (wordDuration + this.translationTimeout) * TRANSLATION_LOOP_MAX + this.nextWordTimeout
    const loopDuration = (originalDuration + translationDuration) * this.props.currentCards.length
    const totalDuration = (loopDuration + this.repeatAllTimeout + repeatingSentenceDuration + this.originalTimeout) *
      (LESSON_LOOP_MAX - 1) + loopDuration

    return (
      <View>
        <Text>~ Loop Duration: {this.durationStr(loopDuration)}</Text>
        <Text>~ Total Duration: {this.durationStr(totalDuration)}</Text>
      </View>
    )
  }

  render () {
    return (
      <View>
        {this.renderPlaybackButtons()}
        <View>
          {this.renderTime()}
          <VolumeSlider volume={this.props.volume} onChange={(volume) => this.props.changeVol(volume)} />
          <SpeedSlider speed={this.props.speed} onChange={(speed) => this.props.changeSpeed(speed)} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const lessonHelper = new LessonHelper(state.lesson)
  const cardHelper = new CardHelper(state.lesson)

  return {
    volume: state.playback.volume,
    speed: state.playback.speed,
    lessonLoopCounter: state.lesson.lessonLoopCounter,
    translationLoopCounter: state.lesson.translationLoopCounter,
    playingState: state.lesson.playingState,
    sameWord: state.lesson.sameWord,
    isPaused: state.playback.isPaused,
    playback: state.playback,
    currentCard: cardHelper.currentCard,
    currentCards: lessonHelper.currentCards()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    incCurrentWord: (allowRestart) => dispatch(LessonActions.incCurrentWord(allowRestart)),
    decCurrentWord: () => dispatch(LessonActions.decCurrentWord()),
    changeVol: (volume) => dispatch(PlaybackActions.playbackVolChange(volume)),
    changeSpeed: (speed) => dispatch(PlaybackActions.playbackSpeedChange(speed)),
    play: (sentence, language, volume, speed) => dispatch(
      PlaybackActions.playbackStart(sentence, language, volume, speed)),
    loadPlayingState: () => dispatch(LessonActions.loadPlayingState()),
    playerStart: () => dispatch(PlaybackActions.playerStart()),
    playerNext: () => dispatch(PlaybackActions.playerNext()),
    playerPrev: () => dispatch(PlaybackActions.playerPrev()),
    playerStop: () => dispatch(PlaybackActions.playerStop())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen)
