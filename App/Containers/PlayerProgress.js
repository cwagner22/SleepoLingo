// @flow

import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import { Lesson } from '../Realm/realm'

// Styles
import styles from './Styles/PlayerProgressStyle'

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
    const { currentCards, currentCardIndex } = this.props
    const nbLeft = currentCards.length - currentCardIndex

    // const wordDuration = 2000 // Average time to load one file + play
    // const repeatingSentenceDuration = 2000 // Average time to play repeating sentence
    // const originalDuration = wordDuration + this.originalTimeout // _isFocusMode ? ORIGINAL_TIMEOUT : ORIGINAL_TIMEOUT_SLEEP
    // const translationDuration = (wordDuration + this.translationTimeout) * TRANSLATION_LOOP_MAX + this.nextWordTimeout
    // const loopDuration = (originalDuration + translationDuration) * this.props.currentCards.length
    // const totalDuration = (loopDuration + this.repeatAllTimeout + repeatingSentenceDuration + this.originalTimeout) *
    //   (LESSON_LOOP_MAX - 1) + loopDuration

    return (
      <View style={styles.progress}>
        <Text>{`${nbLeft} cards remaining`}</Text>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const currentLesson = Lesson.getFromId(state.lesson.currentLessonId)

  return {
    currentCards: currentLesson.cards,
    currentCardIndex: currentLesson.cards.findIndex((c) => c.id === state.lesson.currentCardId)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerProgress)
