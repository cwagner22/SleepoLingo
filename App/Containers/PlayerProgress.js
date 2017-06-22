// @flow

import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import ProgressBar from 'react-native-progress/Bar'

import { Lesson } from '../Realm/realm'
import { LESSON_LOOP_MAX } from '../Sagas/PlaybackSagas'
import Time from '../Services/Time'

// Styles
import styles from './Styles/PlayerProgressStyle'
import { Colors, Metrics } from '../Themes/'

class PlayerProgress extends React.Component {
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

  render () {
    const {currentCards, currentCardIndex, lessonLoopCounter, elapsedTime, duration} = this.props
    const nbLeft = currentCards.length - currentCardIndex

    const nbPlayedPreviousLoop = lessonLoopCounter * currentCards.length
    const nbPlayed = nbPlayedPreviousLoop + currentCardIndex
    const progress = nbPlayed / (currentCards.length * LESSON_LOOP_MAX)

    return (
      <View>
        <View style={styles.infoContainer}>
          <Text style={styles.timeElapsed}>{Time.formattedTime(elapsedTime)}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{`${nbLeft} cards remaining (${lessonLoopCounter + 1}/${LESSON_LOOP_MAX})`}</Text>
          </View>
          <Text style={styles.timeLeft}>{Time.formattedTime(duration - elapsedTime)}</Text>
        </View>
        <ProgressBar height={1} progress={progress} width={Metrics.screenWidth} style={styles.progressBar}
          color={Colors.darkGrey}
          borderColor='transparent' unfilledColor='rgba(255,255,255, 0.1)' />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const currentLesson = Lesson.getFromId(state.lesson.currentLessonId, true)

  return {
    currentCards: currentLesson.cards,
    currentCardIndex: currentLesson.cards.findIndex((c) => c.id === state.lesson.currentCardId),
    lessonLoopCounter: state.playback.lessonLoopCounter,
    duration: state.playback.duration,
    elapsedTime: state.playback.elapsedTime
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerProgress)
