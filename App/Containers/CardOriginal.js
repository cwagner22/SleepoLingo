// @flow

import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'

import styles from './Styles/AnkiScreenStyle'

type CardOriginalProps = {
  text: string,
  onPress: () => void,
}

class CardOriginal extends React.Component {
  props: CardOriginalProps

  render () {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={() => this.props.onPress()}>
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.text}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default CardOriginal
