// @flow

import React, { PropTypes } from 'react'
import { View, Text, ListView } from 'react-native'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import LessonActions from '../Redux/LessonRedux'
// import FullButton from '../Components/FullButton'
import RoundedButton from '../Components/RoundedButton'

// Styles
import styles from './Styles/LessonsListScreenStyle'

import { Actions as NavigationActions } from 'react-native-router-flux'

class LessonsListScreen extends React.Component {
  state: {
    dataSource: Object
  }

  componentWillMount () {
    this.props.loadLessons()
  }

  createDataBlob () {
    var dataBlob = {}

    for (var key in this.props.lessonGroup) {
      // Check also if property is not inherited from prototype
      if (this.props.lessonGroup.hasOwnProperty(key)) {
        dataBlob[key] = {}
        var lessonGroup = this.props.lessonGroup[key]

        for (var val of lessonGroup.content) {
          var lesson = this.props.lesson[val]
          dataBlob[key][lesson.id] = lesson
        }
      }
    }

    return dataBlob
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
    console.log(dataBlob)

    // Datasource is always in state
    this.state = {
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

  renderHeader (data, sectionID) {
    return <Text style={styles.boldLabel}>{sectionID}</Text>
  }

  renderRow (lesson, sectionID) {
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
    lessonGroup: state.lesson.lessonGroup,
    lesson: state.lesson.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadLessons: () => dispatch(LessonActions.loadLessons()),
    startLesson: (lesson) => dispatch(LessonActions.lessonStart(lesson))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsListScreen)
