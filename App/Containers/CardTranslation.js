// @flow

import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import Player from '../Services/Player'

// Styles
import styles from './Styles/AnkiScreenStyle'

class CardTranslation extends React.Component {
  render () {
    return (
      <View>
        <Text onPress={() => Player.speakWordInLanguage(this.props.currentWord.translation, 'th-TH', 0.4)}
          style={styles.title}>{this.props.currentWord.translation}</Text>
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
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(CardTranslation)
