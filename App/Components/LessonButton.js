// @flow

import React, { PropTypes } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'

import styles from './Styles/LessonButtonStyle'
import { Colors } from '../Themes/'

export default class LessonButton extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    nbLeft: PropTypes.number,
    isCompleted: PropTypes.bool,
    styles: PropTypes.func
  }

  completedStyle () {
    if (this.props.isCompleted) {
      return {
        opacity: 0.5,
        backgroundColor: Colors.pastelGreen
      }
    }
  }

  renderNbLeft () {
    if (!this.props.isCompleted) {
      return (
        <Text style={styles.nbLeft}>{this.props.nbLeft}</Text>
      )
    } else {
      return (
        <Icon name='done' color='white' />
      )
    }
  }

  render () {
    return (
      <TouchableOpacity style={[styles.button, this.completedStyle()]} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
        <View style={styles.rightContainer}>
          {this.renderNbLeft()}
        </View>
      </TouchableOpacity>
    )
  }
}
