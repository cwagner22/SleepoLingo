// @flow

import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import LessonActions from '../Redux/LessonRedux'
import FullButton from '../Components/FullButton'

// Styles
import styles from './Styles/AnkiScreenStyle'

class CardTranslation extends React.Component {
  hard () {
    this.props.ankiHard()
    this.props.loadNextCard()
  }

  render () {
    return (
      <View>
        <Text style={styles.title}>{this.props.currentWord.translation}</Text>
        <FullButton text='Hard' onPress={() => this.hard()} />
        <FullButton text='Easy' onPress={() => this.easy()} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentWord: state.lesson.currentWord
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ankiHard: () => dispatch(LessonActions.ankiHard()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardTranslation)
