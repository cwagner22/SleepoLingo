// @flow

import React from 'react'
import { View, Text } from 'react-native'

import styles from './Styles/AnkiScreenStyle'

type CardOriginalProps = {
  text: string,
  onPress: () => void,
}

class CardOriginal extends React.Component {
  props: CardOriginalProps

  render () {
    return (
      <View>
        <Text style={styles.title} onPress={() => this.props.onPress()}>{this.props.text}</Text>
      </View>
    )
  }
}

export default CardOriginal
