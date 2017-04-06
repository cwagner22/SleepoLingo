// @flow

import React from 'react'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'

import LessonActions from '../Redux/LessonRedux'
import CardOriginal from './CardOriginal'
import CardTranslation from './CardTranslation'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  componentWillMount () {
    this.props.loadNextCard()
  }

  renderTranslation () {
    if (this.props.lesson.showAnswer) {
      return (
        <CardTranslation />
      )
    }
  }

  render () {
    if (this.props.lesson.currentWord) {
      return (
        <View style={styles.mainContainer}>
          <ScrollView style={styles.container}>
            <CardOriginal text={this.props.lesson.currentWord.original} onPress={() => { this.props.showAnswer() }} />
            {this.renderTranslation()}
          </ScrollView>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    lesson: state.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
