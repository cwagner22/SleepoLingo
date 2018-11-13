// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'

import styles from './Styles/ExplanationStyle'

export default class Explanation extends React.Component {
  static propTypes = {
    explanation: PropTypes.array
  }

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
