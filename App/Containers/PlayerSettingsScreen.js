// @flow

import React from 'react'
import { View, Button, StatusBar, Platform } from 'react-native'
import { connect } from 'react-redux'
import SettingsList from 'react-native-settings-list'
import DialogAndroid from 'react-native-dialogs'
import Picker from 'react-native-picker'

import PlaybackActions from '../Redux/PlaybackRedux'

// Styles
import styles from './Styles/PlayerSettingsScreenStyle'

class PlayerSettingsScreen extends React.Component {
  state = {controlOS: false}

  static navigationOptions = ({navigation, screenProps}) => {
    return {
      title: 'Settings',
      headerLeft: Platform.OS === 'ios' ? null : undefined,
      headerRight: Platform.OS === 'ios' ? (
        <Button onPress={() => navigation.goBack()} title='Done' />
      ) : null
    }
  }

  componentWillMount () {
    StatusBar.setBarStyle('dark-content')
  }

  componentWillUnmount () {
    StatusBar.setBarStyle('light-content')
  }

  // setControlOS (val) {
  //   this.setState({controlOS: val})
  //   this.props.setControlOS(val)
  // }

  onNumberOfRepeatsSelect (selectedIndex, selectedItem) {
    this.props.loopMaxChange(selectedIndex + 1)
  }

  openNumberOfRepeats () {
    const items = ['1 time', '2 times', '3 times', '4 times', '5 times', '6 times']

    if (Platform.OS === 'ios') {
      Picker.init({
        pickerCancelBtnText: 'Cancel',
        pickerConfirmBtnText: 'Done',
        pickerTitleText: 'Repeat',
        pickerData: items,
        selectedValue: [items[this.props.lessonLoopMax - 1]],
        onPickerConfirm: data => {
          if (data) {
            this.onNumberOfRepeatsSelect(items.indexOf(data[0]))
          }
        }
      })
      Picker.show()
    } else {
      var options = {
        title: 'Number Of Lesson Repeats',
        items: items,
        itemsCallbackSingleChoice: this.onNumberOfRepeatsSelect.bind(this),
        selectedIndex: this.props.lessonLoopMax - 1,
        negativeText: 'Cancel'
      }

      var dialog = new DialogAndroid()
      dialog.set(options)
      dialog.show()
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <SettingsList borderColor={Platform.OS === 'ios' ? '#c8c7cc' : '#d6d5d9'} defaultItemSize={50}>
          { Platform.OS === 'ios' ? (
            <SettingsList.Header headerText='Player' headerStyle={styles.header} />
          ) : (
            <SettingsList.Item
              hasNavArrow={false}
              title='Player'
              titleStyle={styles.header}
              borderHide={'Both'}
            />
          )}
          {/* <Slider value={this.props.lessonLoopMax} onChange={this.props.changeLoopMax} /> */}

          <SettingsList.Item
            hasNavArrow={false}
            switchState={this.props.controlOS}
            switchOnValueChange={this.props.setControlOS}
            // switchState={this.state.switchValue}
            hasSwitch
            title='Control Player From OS'
            // itemWidth={70}
            titleStyle={styles.title}
          />
          { Platform.OS === 'ios' ? (
            <SettingsList.Item
              hasNavArrow
              titleInfo={this.props.lessonLoopMax.toString()}
              title='Number Of Repeats'
              titleStyle={styles.title}
              onPress={() => this.openNumberOfRepeats()} />
          ) : (
            <SettingsList.Item
              hasNavArrow={false}
              titleInfo={`Repeat the lesson ${this.props.lessonLoopMax} times`}
              titleInfoPosition='Bottom'
              title='Number Of Repeats'
              titleStyle={styles.title}
              titleInfoStyle={styles.titleInfo}
              itemWidth={70}
              onPress={() => this.openNumberOfRepeats()} />
          )}
        </SettingsList>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    controlOS: state.playback.controlOS,
    lessonLoopMax: state.playback.lessonLoopMax
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeLoopMax: (val) => dispatch(PlaybackActions.playbackLoopMaxChange(val)),
    setControlOS: (val) => dispatch(PlaybackActions.playbackSetControlOS(val)),
    loopMaxChange: (val) => dispatch(PlaybackActions.playbackLoopMaxChange(val))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSettingsScreen)
