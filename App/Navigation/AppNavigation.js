import React from 'react'
import { StackNavigator, DrawerNavigator, HeaderBackButton } from 'react-navigation'

import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/LoginScreen'
import LessonsListScreen from '../Containers/LessonsListScreen'
import LessonScreen from '../Containers/LessonScreen'
import AnkiScreen from '../Containers/AnkiScreen'
import ImportScreen from '../Containers/ImportScreen'
import WordsListScreen from '../Containers/WordsListScreen'
import DrawerButton from '../Components/DrawerButton'
import SettingsScreen from '../Containers/SettingsScreen'
import ContactScreen from '../Containers/ContactScreen'
import PlayerSettingsScreen from '../Containers/PlayerSettingsScreen'

// import styles from './Styles/NavigationStyles'
import { Colors } from '../Themes/'

// To be able to use modals with cards we have to wrap the cards stack inside a modal stack
// https://github.com/react-community/react-navigation/issues/707#issuecomment-299859578
const MainCardNavigator = StackNavigator({
  LessonsListScreen: {
    screen: LessonsListScreen
    // navigationOptions: ({navigation}) => ({
    //   // header: null
    // })
  },
  LessonScreen: {
    screen: LessonScreen
  },
  AnkiScreen: {
    screen: AnkiScreen
  },
  WordsListScreen: {
    screen: WordsListScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Words'
      // headerBackTitle: 'Back'
    })
  }
}, {
  headerMode: 'none',
  navigationOptions: ({navigation}) => ({
    // Keep drawer locked by default, unlock it in the LessonsListScreen
    drawerLockMode: 'locked-closed',
    // We have to manually add the headerLeft back...
    headerLeft: <HeaderBackButton title='Back' onPress={() => navigation.dispatch({ type: 'Navigation/BACK' })} />
  })
})

// Modals + Main StackNavigator
const MainModalNavigator = StackNavigator({
  LessonsListScreen: {
    screen: MainCardNavigator
    // navigationOptions: ({navigation}) => ({
    //   drawerLockMode: 'unlocked'
    // })
  },
  PlayerSettingsScreen: {
    screen: PlayerSettingsScreen,
    navigationOptions: ({navigation}) => ({
      drawerLockMode: 'locked-closed'
    })
  }
  // PlayerScreen: {
  //   screen: PlayerScreen,
  //   navigationOptions: () => ({
  //     header: null
  //   })
  // }
}, {
  mode: 'modal'
  // headerMode: 'none'
})

// Wrapping DrawerNavigator with a StackNavigator having a header causes some display issues
// See: https://github.com/react-community/react-navigation/issues/131#issuecomment-309236263
const Drawer = DrawerNavigator({
  LessonsList: {
    screen: MainModalNavigator
  },
  Settings: {
    screen: StackNavigator({
      SettingsScreen: {
        screen: SettingsScreen,
        navigationOptions: ({navigation}) => ({
          drawerLabel: 'Settings',
          title: 'Settings',
          headerLeft: <DrawerButton navigation={navigation} />
        })
      }
    })
  },
  Contact: {
    screen: StackNavigator({
      ContactScreen: {
        screen: ContactScreen,
        navigationOptions: ({navigation}) => ({
          drawerLabel: 'Contact',
          title: 'Contact',
          headerLeft: <DrawerButton navigation={navigation} />
        })
      }
    })
  }
}, {
  contentOptions: {
    activeTintColor: Colors.cheeryPink
  }
})

// const forceDevScreen = 'LaunchScreen'
const forceDevScreen = 'LessonsList'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: {screen: LaunchScreen},
  LessonsList: {
    screen: Drawer
  },
  ImportScreen: {
    screen: ImportScreen
  },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {title: 'Login'}
  }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: __DEV__ ? forceDevScreen : 'LessonsList'
  // navigationOptions: {
  //   header: {
  //     style: styles.header
  //   }
  // }
})

export default PrimaryNav

export const reducer = (state, action) => {
  const newState = PrimaryNav.router.getStateForAction(action, state)
  return newState || state
}
