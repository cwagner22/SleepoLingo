// @flow

import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import LessonActions from '../Redux/LessonRedux'
import AnkiButton from '../Components/AnkiButton'

// Styles
import styles from './Styles/AnkiFooterStyle'

class AnkiFooter extends React.Component {
  hard () {
    this.props.ankiHard()
    this.props.loadNextCard()
  }

  ok () {
    this.props.ankiOk()
    this.props.loadNextCard()
  }

  easy () {
    this.props.ankiEasy()
    this.props.loadNextCard()
  }

  render () {
    return (
      <View style={styles.ankiFooter}>
        <AnkiButton styles={styles.ankiHard} text='Hard' subText='(1 min)' onPress={() => this.hard()} />
        <AnkiButton styles={styles.ankiOk} text='OK' subText='(10 mins)' onPress={() => this.ok()} />
        <AnkiButton styles={styles.ankiEasy} text='Easy' subText='(1 day)' onPress={() => this.easy()} />
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
    ankiOk: () => dispatch(LessonActions.ankiOk()),
    ankiEasy: () => dispatch(LessonActions.ankiEasy()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiFooter)
