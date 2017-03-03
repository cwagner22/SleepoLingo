// @flow

import React, { PropTypes } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import LessonActions from '../Redux/LessonRedux'
import FullButton from '../Components/FullButton'

// Styles
import styles from './Styles/LessonScreenStyle'

import { Actions as NavigationActions } from 'react-native-router-flux'

const lessons = [
  require('../lesson1.json'),
  require('../lesson2.json'),
  require('../lesson3.json'),
  require('../lesson4.json')
]

class LessonScreen extends React.Component {
  api: Object

  state: {
    // translation: null,
    results: null
  }

  constructor (props) {
    super(props)

    var cachePath = RNFS.DocumentDirectoryPath + '/cache'

    if (__DEV__) {
      // Empty cache
      RNFS.exists(cachePath).then((exists) => {
        var pomise = exists ? RNFS.unlink(cachePath) : Promise.resolve()
        pomise.then(this.createCache)
      })
    } else {
      this.createCache()
    }
  }

  createCache () {
    var cachePath = RNFS.DocumentDirectoryPath + '/cache'
    RNFS.mkdir(cachePath, {NSURLIsExcludedFromBackupKey: true})
  }

  render () {
    // const { translation } = this.props

    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <Text style={styles.componentLabel}>Choose a lesson</Text>
          {this.renderLessons()}
        </ScrollView>
      </View>
    )
  }

  startLesson (lesson) {
    this.props.startLesson(lesson)
    NavigationActions.playback()
  }

  renderLesson (lesson: Object) {
    return (
      <FullButton text={lesson.title} onPress={() => this.startLesson(lesson)} key={lesson.id} />
    )
  }

  renderLessons () {
    return <View style={{marginTop: 10}}>
      {lessons.map((lesson) => this.renderLesson(lesson))}
    </View>
  }
}

LessonScreen.propTypes = {
  startLesson: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    // translation: state.translation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLesson: (lesson) => dispatch(LessonActions.lessonStart(lesson))
    // requestTemperature: (city) => dispatch(TemperatureActions.temperatureRequest(city))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
