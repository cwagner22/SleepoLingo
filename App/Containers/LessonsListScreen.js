// @flow

import React from 'react'
import { View, Text } from 'react-native'
import { ListView } from 'realm/react-native'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs'

import LessonActions from '../Redux/LessonRedux'
import LessonButton from '../Components/LessonButton'
import { LessonGroup } from '../Realm/realm'

// Styles
import styles from './Styles/LessonsListScreenStyle'

class LessonsListScreen extends React.Component {
  state = {}

  componentWillMount () {
    this.setupDataSource()
  }

  setupDataSource (props) {
    const rowHasChanged = (r1, r2) => r1 !== r2
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2

    const ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})

    let data = {}
    const groups = LessonGroup.get()

    // for (const group of groups) { // not working on android
    //   data[group.name] = group.lessons
    // }
    for (var i = 0; i < groups.length; i++) {
      const group = groups[i]
      data[group.name] = group.lessons
    }

    // Datasource is always in state
    this.setState({
      dataSource: ds.cloneWithRowsAndSections(data)
    })
  }

  constructor (props) {
    super(props)

    var cachePath = RNFS.DocumentDirectoryPath + '/cache'

    // if (__DEV__) {
    //   // Empty cache
    //   RNFS.exists(cachePath).then((exists) => {
    //     var pomise = exists ? RNFS.unlink(cachePath) : Promise.resolve()
    //     pomise.then(this.createCache)
    //   })
    // } else {
    //   this.createCache()
    // }

    RNFS.exists(cachePath).then((exists) => {
      if (!exists) {
        this.createCache()
      }
    })
  }

  createCache () {
    var cachePath = RNFS.DocumentDirectoryPath + '/cache'
    RNFS.mkdir(cachePath, {NSURLIsExcludedFromBackupKey: true})
  }

  goToLesson (lesson) {
    this.props.loadLesson(lesson.id)
    // this.props.navigateToLesson(lesson.id)
  }

  renderHeader (data, sectionID) {
    return (
      <View>
        <Text style={styles.header}>{sectionID}</Text>
      </View>
    )
  }

  nbCardsLeft (lesson) {
    return lesson.cards.reduce((total, card) => {
      if (card.isReady(this.props.showDates, false)) {
        total++
      }
      return total
    }, 0)
  }

  renderRow (lesson, sectionID) {
    const isCompleted = !!this.props.completedLessons[lesson.id]
    return (
      <LessonButton text={lesson.name} nbLeft={this.nbCardsLeft(lesson)} onPress={() => this.goToLesson(lesson)}
        isCompleted={isCompleted} />
    )
  }

  render () {
    if (!this.state.dataSource) return null

    return (
      <View style={styles.container}>
        <ListView
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showDates: state.lesson.showDates,
    completedLessons: state.lesson.completedLessons
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadLesson: (lesson) => dispatch(LessonActions.loadLesson(lesson))
    // navigateToLesson: (lessonId) => dispatch(navigateToLesson(lessonId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsListScreen)
