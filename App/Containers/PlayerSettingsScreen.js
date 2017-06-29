// @flow

import React from 'react'
import { View, Button, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import SettingsList from 'react-native-settings-list'

// Styles
import styles from './Styles/PlayerSettingsScreenStyle'

class PlayerSettingsScreen extends React.Component {
  state = {switchValue: false}

  static navigationOptions = ({navigation, screenProps}) => {
    return {
      title: 'Settings',
      headerLeft: null,
      headerRight: (
        <Button onPress={() => navigation.goBack()} title='Done' />
      )
    }
  }

  componentWillMount () {
    StatusBar.setBarStyle('dark-content')
  }

  componentWillUnmount () {
    StatusBar.setBarStyle('light-content')
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <SettingsList borderColor='#c8c7cc'>
          <SettingsList.Header headerText='First Grouping' headerStyle={styles.header} />
          <SettingsList.Item
            hasNavArrow={false}
            // switchProps={this.props.controlOS}
            // switchOnValueChange={this.onValueChange}
            switchState={this.state.switchValue}
            hasSwitch
            title='Switch Example' />
          {/* <SettingsList.Item
            title='Different Colors Example'
            backgroundColor='#D1D1D1'
            titleStyle={{color: 'blue'}}
            arrowStyle={{tintColor: 'blue'}}
            onPress={() => Alert.alert('Different Colors Example Pressed')} />
          <SettingsList.Header headerText='Different Grouping' headerStyle={{color: 'white', marginTop: 50}} />
          <SettingsList.Item titleInfo='Some Information' hasNavArrow={false} title='Information Example' />
          <SettingsList.Item title='Settings 1' />
          <SettingsList.Item title='Settings 2' /> */}
        </SettingsList>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    controlOS: false
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // navigateToLesson: (lessonId) => dispatch(navigateToLesson(lessonId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSettingsScreen)
