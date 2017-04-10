// @flow

import React, { PropTypes } from 'react'
import { View, Text, ListView } from 'react-native'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs'
import { normalize } from 'normalizr'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import LessonActions from '../Redux/LessonRedux'
import FullButton from '../Components/FullButton'
import RoundedButton from '../Components/RoundedButton'
import { lessonsValuesSchema } from '../Redux/schema'

// Styles
import styles from './Styles/LessonsListScreenStyle'

import { Actions as NavigationActions } from 'react-native-router-flux'

import lessons from '../Lessons'

class LessonsListScreen extends React.Component {
  state: {
    results: null,
    dataSource: Object
  }

  createDataBlob () {
    const normalizedData = normalize(lessons, lessonsValuesSchema)
    this.lessons = normalizedData.entities

    var lessonGroups = normalizedData.entities.lessonGroup

    for (var key in lessonGroups) {
      // check also if property is not inherited from prototype
      if (lessonGroups.hasOwnProperty(key)) {
        lessonGroups[key] = lessonGroups[key].content
      }
    }

    return lessonGroups
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

    const rowHasChanged = (r1, r2) => r1 !== r2
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})

    var dataBlob = this.createDataBlob()
    console.log(this.lessons)

    // Datasource is always in state
    this.state = {
      // lessons: normalizedData.entities,
      dataSource: ds.cloneWithRowsAndSections(dataBlob)
    }
  }

  createCache () {
    var cachePath = RNFS.DocumentDirectoryPath + '/cache'
    RNFS.mkdir(cachePath, {NSURLIsExcludedFromBackupKey: true})
  }

  startLesson (lesson) {
    this.props.startLesson(lesson)
    NavigationActions.lesson()
  }

  renderLesson (lessonContent) {
    return (
      <FullButton text={lessonContent.title} onPress={() => this.startLesson(lessonContent)} key={lessonContent.id} />
    )
  }

  renderLessonGroup (lesson: Object) {
    return (
      <View key={lesson.group}>
        <Text>{lesson.group}</Text>
        {lesson.content.map((lessonContent) => this.renderLesson(lessonContent))}
      </View>
    )
  }

  renderLessons () {
    return <View style={{marginTop: 10}}>
      {lessons.map((lesson) => this.renderLessonGroup(lesson))}
    </View>
  }

  renderHeader (data, sectionID) {
    return <Text style={styles.boldLabel}>{sectionID}</Text>
  }

  renderRow (rowData, sectionID) {
    var lesson = this.lessons.lesson[rowData]

    return (
      <RoundedButton styles={styles.label} text={lesson.title} onPress={() => this.startLesson(lesson)} />
    )
  }

  render () {
    // const { translation } = this.props

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

LessonsListScreen.propTypes = {
  startLesson: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLesson: (lesson) => dispatch(LessonActions.lessonStart(lesson))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsListScreen)
