// @flow

import React, { PropTypes } from 'react'
import { Slider as RNSlider } from 'react-native-elements'

import { Colors } from '../Themes/'
// import styles from './Styles/SliderStyle'

export default class Slider extends React.Component {
  static PropTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func
  }

  render () {
    return (
      <RNSlider
        style={{flex: 1}}
        value={this.props.value}
        minimumValue={1}
        maximumValue={10}
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
    )
  }
}
