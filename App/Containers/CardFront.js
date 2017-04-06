// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import LessonActions from '../Redux/LessonRedux'

// Styles
import styles from './Styles/AnkiScreenStyle'

class CardFront extends React.Component {
  getNextCard () {
    var sortedWords = _.sortBy(this.props.lesson.lesson.words, ['showDate', 'id'])
      .filter((word) => {
        // Exclude future cards
        if (word.showDate) {
          console.log(new Date(word.showDate))
          console.log(word.showDate < new Date())
        }
        return !word.showDate || word.showDate < new Date()
      })
    console.log(sortedWords)
    this.props.setCurrentWord(sortedWords[0])
  }

  componentWillMount () {
    this.getNextCard()
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <Text style={styles.componentLabel} onPress={() => this.props.showBack()}>{this.props.lesson.currentWord && this.props.lesson.currentWord.original}</Text>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lesson: state.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showBack: () => dispatch(LessonActions.ankiShowBack()),
    setCurrentWord: (word) => dispatch(LessonActions.setCurrentWord(word))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardFront)
