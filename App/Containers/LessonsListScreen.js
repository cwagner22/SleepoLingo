// @flow

import React, { PropTypes } from 'react'
import { View, Text } from 'react-native'
import { ListView } from 'realm/react-native'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs'

import LessonActions from '../Redux/LessonRedux'
import LessonButton from '../Components/LessonButton'
import { LessonGroup } from '../Realm/realm'
// import store from '../store'

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
    for (const group of LessonGroup.get()) {
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
    this.props.loadLesson(lesson)
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
      if (card.isReady(this.props.showDates, true)) {
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
  return {
    showDates: state.lesson.showDates
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadLesson: (lesson) => dispatch(LessonActions.loadLesson(lesson))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsListScreen)
