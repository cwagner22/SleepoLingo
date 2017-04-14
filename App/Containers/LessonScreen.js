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
    this.props.loadLesson(this.props.data)
  }

  render () {
    const { currentLesson } = this.props
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <Text style={styles.componentLabel}>{currentLesson.note}</Text>
        </ScrollView>
        <FullButton text='Day' onPress={() => this.startDay()} />
        <FullButton text='Night' onPress={() => this.startNight()} />
      </View>
    )
  }

  startDay () {
    NavigationActions.anki(this.props.data)
  }

  startNight () {
    NavigationActions.playback(this.props.data)
  }
}

const mapStateToProps = (state) => {
  return {
    currentLesson: state.lesson.lessons[state.lesson.currentLessonId]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadLesson: (lessonId) => dispatch(LessonActions.loadLesson(lessonId))}
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
