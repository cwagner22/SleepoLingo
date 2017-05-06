// @flow

import React from 'react'
import { View, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import LessonActions from '../Redux/LessonRedux'
import CardOriginal from './CardOriginal'
import CardTranslation from './CardTranslation'
import AnkiFooter from './AnkiFooter'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  componentWillMount () {
    this.props.startLesson()
    this.props.loadNextCard()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentCard !== this.props.currentCard && !nextProps.currentCard) {
      Alert.alert(
        'Well done',
        'No more cards, come back later!',
        [
          {text: 'OK', onPress: () => NavigationActions.lessonsList({type: 'reset'})}
        ]
      )
    }
  }

  renderCard () {
    if (this.props.lesson.showFront) {
      return (
        <CardOriginal text={this.props.currentCard.sentence.original}
          fullText={this.props.currentCard.fullSentence && this.props.currentCard.fullSentence.original}
          onPress={() => { this.props.showBack() }} />
      )
    } else {
      return (
        <CardTranslation onPress={() => { this.props.showFront() }} />
      )
    }
  }

  renderFooter () {
    if (this.props.lesson.showAnswer) {
      return (
        <AnkiFooter />
      )
    }
  }

  render () {
    if (!this.props.currentCard) {
      return null
    }

    return (
      <View style={styles.mainContainer}>
        {this.renderCard()}
        {this.renderFooter()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  // const cardHelper = new CardHelper(state.lesson)

  return {
    lesson: state.lesson,
    currentCard: state.lesson.currentCard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    showFront: () => dispatch(LessonActions.lessonShowFront()),
    showBack: () => dispatch(LessonActions.lessonShowBack()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard()),
    startLesson: () => dispatch(LessonActions.lessonStart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
