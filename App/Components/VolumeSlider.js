import React from 'react'
import {
  Slider,
  Text,
  View
} from 'react-native'
import styles from './Styles/SearchBarStyle'

export default class VolumeSlider extends React.Component {

  static defaultProps = {
    value: 0.5
  }

  state = {
    value: this.props.value
  }

  render () {
    return (
      <View>
        <Text style={styles.text} >
          {this.state.value && +this.state.value.toFixed(3)}
        </Text>
        <Slider
          {...this.props}
          onValueChange={(value) => this.setState({value: value})} />
      </View>
    )
  }
}
