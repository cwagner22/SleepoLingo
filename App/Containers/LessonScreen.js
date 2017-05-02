// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import FullButton from '../Components/FullButton'
import LessonActions from '../Redux/LessonRedux'
import LessonHelper from '../Services/LessonHelper'

// Styles
import styles from './Styles/LessonScreenStyle'

import { Actions as NavigationActions } from 'react-native-router-flux'

class LessonScreen extends React.Component {
  componentWillMount () {
    this.props.loadLesson(this.props.data)
  }

  componentDidMount () {
    this.props.downloadLesson(this.props.currentCards)
  }

  render () {
    const {currentLesson} = this.props

    if (_.isUndefined(currentLesson)) return null

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
    NavigationActions.anki()
  }

  startNight () {
    NavigationActions.playback()
  }
}

const mapStateToProps = (state) => {
  const lessonHelper = new LessonHelper(state.lesson)
  return {
    currentLesson: lessonHelper.currentLesson,
    currentCards: lessonHelper.currentCards()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadLesson: (lessonId) => dispatch(LessonActions.loadLesson(lessonId)),
    downloadLesson: (words) => dispatch(LessonActions.downloadLesson(words))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
