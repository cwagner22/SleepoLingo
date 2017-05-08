// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import FullButton from '../Components/FullButton'
import LessonActions from '../Redux/LessonRedux'

// Styles
import styles from './Styles/LessonScreenStyle'

import { Actions as NavigationActions } from 'react-native-router-flux'

class LessonScreen extends React.Component {
  componentWillMount () {
    this.props.downloadLesson(this.props.lesson.cards)
  }

  render () {
    const {lesson} = this.props

    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <Text style={styles.componentLabel}>{lesson.note}</Text>
        </ScrollView>
        <FullButton text='Day' onPress={() => this.startDay()} />
        <FullButton text='Night' onPress={() => this.startNight()} />
      </View>
    )
  }

  startDay () {
    NavigationActions.anki()
  }

  startNight () {
    NavigationActions.playback()
  }
}

const mapStateToProps = (state) => {
  return {
    currentLesson: state.lesson.currentLesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadLesson: (lesson) => dispatch(LessonActions.loadLesson(lesson)),
    downloadLesson: (words) => dispatch(LessonActions.downloadLesson(words))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
