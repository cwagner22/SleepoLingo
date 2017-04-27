// @flow

import React, { PropTypes } from 'react'
import { View, Text, ListView } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import RNFS from 'react-native-fs'
// import Realm from 'realm'

import LessonActions from '../Redux/LessonRedux'
import LessonButton from '../Components/LessonButton'
import WordHelper from '../Services/WordHelper'
import realm from '../Realm/realm'

// Styles
import styles from './Styles/LessonsListScreenStyle'

class LessonsListScreen extends React.Component {
  state = {
    // dataSource: Object
  }

  componentWillMount () {
    this.props.loadLessons()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.lessonGroups !== this.props.lessonGroups) {
      this.setupDataSource(nextProps)
    }
  }

  createDataBlob (props) {
    var dataBlob = {}

    for (var key in props.lessonGroups) {
      // Check also if property is not inherited from prototype
      if (props.lessonGroups.hasOwnProperty(key)) {
        dataBlob[key] = {}
        var lessonGroup = props.lessonGroups[key]

        for (var val of lessonGroup.content) {
          var lesson = props.lessons[val]
          dataBlob[key][lesson.id] = lesson
        }
      }
    }

    return dataBlob
  }

  setupDataSource (props) {
    const rowHasChanged = (r1, r2) => r1 !== r2
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})

    var dataBlob = this.createDataBlob(props)
    // Datasource is always in state
    this.setState({
      dataSource: ds.cloneWithRowsAndSections(dataBlob)
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

  goToLesson (lessonId) {
    NavigationActions.lesson(lessonId)
  }

  renderHeader (data, sectionID) {
    return <Text style={styles.boldLabel}>{sectionID}</Text>
  }

  nbCardsLeft (lesson) {
    return lesson.words.reduce((total, wordId) => {
      if (this.props.wordHelper.isReady(wordId, true)) {
        total++
      }
      return total
    }, 0)
  }

  renderRow (lesson, sectionID) {
    return (
      <LessonButton text={lesson.title} nbLeft={this.nbCardsLeft(lesson)} onPress={() => this.goToLesson(lesson.id)} />
    )
  }

  render () {
    if (!this.state.dataSource) return null

    // realm.write(() => {
    // realm.create('Sentence', {words: ['aa', 'bb']})
    // let sentence = realm.create('Sentence', {words: [{val: 'Hello'}, {val: 'my'}, {val: 'name'}, {val: 'is'}, {val:
    // 'Chris'}]})

    let sentence = realm.objects('Sentence')[0]
    console.log(sentence, sentence.id, sentence.model)

    // realm.create('Card', {
    //   sentence: sentence.id
    // })
    // })

    return (
      <View style={styles.container}>
        <ListView
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
        <Text style={styles.boldLabel}>
          Count of Dogs in Realm: {realm.objects('Sentence').length}
        </Text>
      </View>
    )
  }
}

LessonsListScreen.propTypes = {
  startLesson: PropTypes.func
}

const mapStateToProps = (state) => {
  const wordHelper = new WordHelper(state.lesson)
  return {
    lessonGroups: state.lesson.lessonGroups,
    lessons: state.lesson.lessons,
    words: state.lesson.words,
    wordHelper
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadLessons: () => dispatch(LessonActions.loadLessons())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsListScreen)
