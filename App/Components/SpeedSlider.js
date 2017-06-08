// @flow

import React from 'react'
import {
  Slider,
  View
} from 'react-native'

// import styles from '../Containers/Styles/VolumeSliderStyle'

type SpeedSliderProps = {
  speed: number,
  onChange: () => void
}

export default class SpeedSlider extends React.Component {
  props: SpeedSliderProps

  render () {
    return (
      <View>
        <Slider value={this.props.speed} step={0.1} minimumValue={0} maximumValue={2}
          onValueChange={this.props.onChange} />
      </View>
    )
  }
}
