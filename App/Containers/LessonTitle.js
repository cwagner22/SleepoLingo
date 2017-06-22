import React from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

import { Lesson } from '../Realm/realm'

import styles from './Styles/LessonTitleStyles'

const LessonTitle = ({ currentLesson }) => (
  <Text style={styles.title} accessibilityTraits='header' numberOfLines={1}>{currentLesson.name}</Text>
)

const mapStateToProps = (state) => {
  return {
    currentLesson: Lesson.getFromId(state.lesson.currentLessonId, true)
  }
}

export default connect(mapStateToProps)(LessonTitle)
