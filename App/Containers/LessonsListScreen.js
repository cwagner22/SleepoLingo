// @flow

import React, { PropTypes } from 'react'
import { View, Text } from 'react-native'
import { ListView } from 'realm/react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import RNFS from 'react-native-fs'
// import Realm from 'realm'

import LessonActions from '../Redux/LessonRedux'
import LessonButton from '../Components/LessonButton'
import {getLessonGroups, isReady} from '../Realm/realm'
// import store from '../store'

// Styles
import styles from './Styles/LessonsListScreenStyle'

class LessonsListScreen extends React.Component {
  state = {
  }

  componentWillMount () {
    this.setupDataSource()
  }

  setupDataSource (props) {
    const rowHasChanged = (r1, r2) => r1 !== r2
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2

    const ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})

    // let lessonGroups = realm.objects('LessonGroup')
    let data = {}
    for (const group of getLessonGroups()) {
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
    // this.props.loadLessonSaga(lessonId)
    // this.props.loadLesson(lessonId)
    // this.props.loadLesson(lesson)
    NavigationActions.lesson({lesson})
  }

  renderHeader (data, sectionID) {
    return <Text style={styles.boldLabel}>{sectionID}</Text>
  }

  nbCardsLeft (lesson) {
    return lesson.cards.reduce((total, card) => {
      // if (this.props.cardHelper.isReady(cardId, true)) {
      if (isReady(card, true)) {
        total++
      }
      return total
    }, 0)
  }

  renderRow (lesson, sectionID) {
    return (
      <LessonButton text={lesson.name} nbLeft={this.nbCardsLeft(lesson)} onPress={() => this.goToLesson(lesson)} />
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

LessonsListScreen.propTypes = {
  startLesson: PropTypes.func
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadLesson: (lesson) => dispatch(LessonActions.loadLesson(lesson))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsListScreen)
