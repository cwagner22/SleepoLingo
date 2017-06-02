// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import { Card, Icon } from 'react-native-elements'
import ActionButton from 'react-native-action-button'

import { Lesson } from '../Realm/realm'
import LessonActions from '../Redux/LessonRedux'
import RoundedButton from '../Components/RoundedButton'

// Styles
import styles from './Styles/LessonScreenStyles'
import { Colors } from '../Themes/'

class LessonScreen extends React.Component {
  componentWillMount () {
    const {lesson} = this.props

    this.props.navigation.setParams({
      title: lesson.name
    })
    this.props.downloadLesson(lesson.cards)
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
            <RoundedButton onPress={() => this.startDay()} styles={styles.button}>
              START STUDY
            </RoundedButton>
          </View>
        </Card>
        <ActionButton buttonColor={Colors.easternBlue} onPress={() => this.startNight()} offsetY={85}
          icon={<Icon name='hotel' color='white' />} />
      </View>
    )
  }

  startDay () {
    this.props.startAnki()
    // this.props.navigation.navigate('AnkiScreen', {title: this.props.lesson.name})
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
    downloadLesson: (words) => dispatch(LessonActions.downloadLesson(words)),
    startAnki: () => dispatch(LessonActions.lessonStartAnki())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
