// @flow

import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import LessonActions from '../Redux/LessonRedux'
import FullButton from '../Components/FullButton'

// Styles
import styles from './Styles/AnkiScreenStyle'

class CardBack extends React.Component {
  hard () {
    this.props.ankiHard()
    this.props.showFront()
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <Text style={styles.componentLabel}>{this.props.currentWord.translation}</Text>
          <FullButton text='Hard' onPress={() => this.hard()} />
          <FullButton text='No' onPress={() => this.easy()} />
        </ScrollView>
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
    showFront: () => dispatch(LessonActions.ankiShowFront())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardBack)
