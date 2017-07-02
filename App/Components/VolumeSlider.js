// @flow

import React from 'react'
import {
  View
} from 'react-native'
import { Slider, Icon } from 'react-native-elements'

import { Colors } from '../Themes/'
import styles from './Styles/VolumeSliderStyle'

type VolumeSliderProps = {
  volume: number,
  onChange: () => void
}

export default class VolumeSlider extends React.Component {
  props: VolumeSliderProps

  renderVolumeIcon () {
    return (
      <Icon iconStyle={styles.buttonIcon} name='play-arrow' />
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <Icon iconStyle={styles.volIcon} name='volume-down' />

        <Slider
          style={{flex: 1}}
          value={this.props.volume}
          onValueChange={this.props.onChange}
          // minimumTrackTintColor='#8F8E9A'
          // maximumTrackTintColor='#36373F'
          // thumbTouchSize={{width: 40, height: 40}}
          // thumbTintColor='#92919F'
          thumbStyle={{
            width: 15,
            height: 15
          }}
          thumbTintColor={Colors.darkGrey}
          minimumTrackTintColor={Colors.darkGrey}
          maximumTrackTintColor='rgba(255,255,255, 0.1)'
        />

        <Icon iconStyle={styles.volIcon} name='volume-up' />
      </View>
    )
  }
}
