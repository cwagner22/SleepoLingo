// @flow

import React, { PropTypes } from 'react'
import {
  Slider,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'

import PlaybackActions from '../Redux/PlaybackRedux'
import styles from './Styles/VolumeSliderStyle'

class VolumeSlider extends React.Component {

  render () {
    return (
      <View>
        <Text style={styles.text} >
          {this.props.volume && +this.props.volume.toFixed(0)}
        </Text>
        <Slider value={this.props.volume} step={0.1} onValueChange={this.props.changeVol} />
      </View>
    )
  }
}

VolumeSlider.propTypes = {
  changeVol: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    volume: state.playback.volume
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeVol: (volume) => dispatch(PlaybackActions.playbackVolChange(volume))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolumeSlider)
