// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import { Card, Button } from 'react-native-elements'

import { Lesson } from '../Realm/realm'
import LessonActions from '../Redux/LessonRedux'

// Styles
import styles from './Styles/LessonScreenStyles'

class LessonScreen extends React.Component {
  componentWillMount () {
    this.props.navigation.setParams({
      title: this.props.lesson.name
    })
    // const {lesson} = this.props.navigation.state.params
    // this.props.downloadLesson(lesson.cards)
  }

  render () {
    const {lesson} = this.props

    return (
      <View style={styles.mainContainer}>
        <Card title='Lesson Notes' containerStyle={{flex: 1}} wrapperStyle={{flex: 1}}>
          <ScrollView>
            <Text style={styles.componentLabel}>{lesson.note}</Text>
          </ScrollView>
          <View>
            <Button title='START STUDY' buttonStyle={styles.button} onPress={() => this.startDay()} />
          </View>
        </Card>
        {/* <FullButton text='Night' onPress={() => this.startNight()} /> */}
      </View>
    )
  }

  startDay () {
    this.props.navigation.navigate('AnkiScreen', {title: this.props.lesson.name})
  }

  startNight () {
    this.props.navigation.navigate('PlaybackScreen')
  }
}

const mapStateToProps = (state) => {
  return {
    lesson: Lesson.getFromId(state.lesson.currentLessonId)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    downloadLesson: (words) => dispatch(LessonActions.downloadLesson(words))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
