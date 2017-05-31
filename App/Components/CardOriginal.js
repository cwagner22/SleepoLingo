// @flow

import React, { PropTypes } from 'react'
import { View, TouchableWithoutFeedback, Text } from 'react-native'

import styles from './Styles/CardOriginalStyles'

class CardOriginal extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    fullText: PropTypes.string,
    styles: PropTypes.func
  }

  renderFullOriginal () {
    if (this.props.fullText) {
      return (
        <Text style={styles.title}>{this.props.fullText}</Text>
      )
    }
  }

  render () {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={() => this.props.onPress()}>
        <View style={{flex: 1}}>
          <View style={styles.translationContainer}>
            <Text style={styles.title}>{this.props.text}</Text>
            { this.renderFullOriginal() }
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default CardOriginal
