// @flow

import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import LessonActions from '../Redux/LessonRedux'
import CardOriginal from './CardOriginal'
import CardTranslation from './CardTranslation'
import AnkiFooter from './AnkiFooter'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  state = {
    showFront: true
  }

  componentWillMount () {
    this.props.loadNextCard()
  }

  changeSide () {
    this.setState({
      showFront: !this.state.showFront
    })
  }

  renderOriginal () {
    if (this.state.showFront) {
      return (
        <CardOriginal text={this.props.lesson.currentWord.original} onPress={() => { this.changeSide() }} />
      )
    }
  }

  renderTranslation () {
    if (!this.state.showFront) {
      return (
        <CardTranslation onPress={() => { this.changeSide() }} />
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
    if (!this.props.lesson.currentWord) {
      return null
    }

    return (
      <View style={styles.mainContainer}>
        {this.renderOriginal()}
        {this.renderTranslation()}
        {this.renderFooter()}
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
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
