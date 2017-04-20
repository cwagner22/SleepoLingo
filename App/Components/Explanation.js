// @flow

import React from 'react'
import { View, Text } from 'react-native'

import styles from './Styles/ExplanationStyle'

type ExplanationProps = {
  explanation: Object,
  // onPress: () => void
}

export default class Explanation extends React.Component {
  props: ExplanationProps

  renderExplanation () {
    return this.props.explanation.map((e, i) => {
      return (
        <View style={styles.row} key={i}>
          <Text style={styles.item}>{e.original}</Text>
          <Text style={styles.item}>{e.transliteration}</Text>
          <Text style={styles.item}>{e.translation}</Text>
        </View>
      )
    })
  }

  render () {
    return (
      <View>
        {this.renderExplanation()}
      </View>
    )
  }
}
