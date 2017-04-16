// @flow

import React from 'react'
import {
  Slider,
  Text,
  View
} from 'react-native'

import styles from '../Containers/Styles/VolumeSliderStyle'

type VolumeSliderProps = {
  volume: number,
  onChange: () => void
}

export default class VolumeSlider extends React.Component {
  props: VolumeSliderProps

  render () {
    return (
      <View>
        <Text style={styles.text} >
          {this.props.volume && +this.props.volume.toFixed(1)}
        </Text>
        <Slider value={this.props.volume} step={0.1} onValueChange={this.props.onChange} />
      </View>
    )
  }
}
