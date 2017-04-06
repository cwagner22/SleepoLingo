// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import FullButton from '../Components/FullButton'

// Styles
import styles from './Styles/LessonScreenStyle'

import { Actions as NavigationActions } from 'react-native-router-flux'

class LessonScreen extends React.Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <Text style={styles.componentLabel}>{this.props.lesson.lesson}</Text>
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
    lesson: state.lesson.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
