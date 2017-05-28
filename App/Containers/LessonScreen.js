// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import FullButton from '../Components/FullButton'
import LessonActions from '../Redux/LessonRedux'

// Styles
import styles from './Styles/LessonScreenStyle'

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
    this.props.navigation.navigate({routeName: 'AnkiScreen'})
  }

  startNight () {
    this.props.navigation.navigate({routeName: 'PlaybackScreen'})
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    downloadLesson: (words) => dispatch(LessonActions.downloadLesson(words))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
