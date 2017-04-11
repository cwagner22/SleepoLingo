// @flow

import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import styles from './Styles/LessonButtonStyle'

type LessonButtonProps = {
  text: string,
  nbLeft: number,
  onPress: () => void
}

export default class LessonButton extends React.Component {
  props: LessonButtonProps

  render () {
    return (
      <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
        <View style={styles.rightContainer}>
          <Text style={styles.nbLeft}>{this.props.nbLeft}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
