// @flow

import React from 'react'
import {
  Slider,
  Text,
  View
} from 'react-native'

import styles from '../Containers/Styles/VolumeSliderStyle'

type SpeedSliderProps = {
  speed: number,
  onChange: () => void
}

export default class SpeedSlider extends React.Component {
  props: SpeedSliderProps

  render () {
    return (
      <View>
        <Text style0={styles.text}>
          {this.props.speed}
        </Text>
        <Slider value={this.props.speed} step={0.1} minimumValue={0} maximumValue={2}
          onValueChange={this.props.onChange} />
      </View>
    )
  }
}
