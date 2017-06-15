import React from 'react'
import { StackNavigator, DrawerNavigator } from 'react-navigation'

import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/LoginScreen'
import LessonsListScreen from '../Containers/LessonsListScreen'
import LessonScreen from '../Containers/LessonScreen'
import AnkiScreen from '../Containers/AnkiScreen'
import PlayerScreen from '../Containers/PlayerScreen'
import ImportScreen from '../Containers/ImportScreen'
import WordsListScreen from '../Containers/WordsListScreen'
import DrawerButton from '../Components/DrawerButton'
import SettingsScreen from '../Containers/SettingsScreen'
import ContactScreen from '../Containers/ContactScreen'

// import styles from './Styles/NavigationStyles'
import { Colors } from '../Themes/'

// Wrapping DrawerNavigator with a StackNavigator having a header causes some display issues
const Drawer = DrawerNavigator({
  LessonsList: {
    screen: StackNavigator({
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
      PlayerScreen: {
        screen: PlayerScreen,
        navigationOptions: () => ({
          header: null
        })
      },
      WordsListScreen: {
        screen: WordsListScreen,
        navigationOptions: ({navigation}) => ({
          title: 'Words'
          // headerBackTitle: 'Back'
        })
      }
    }, {
      navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed' // seems enough to allow only the first page to open the drawer
      })
    })
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
  initialRouteName: __DEV__ ? 'LaunchScreen' : 'LessonsList'
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
