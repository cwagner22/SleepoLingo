import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/LoginScreen'
import LessonsListScreen from '../Containers/LessonsListScreen'
import LessonScreen from '../Containers/LessonScreen'
import AnkiScreen from '../Containers/AnkiScreen'
import PlaybackScreen from '../Containers/PlaybackScreen'
import ImportScreen from '../Containers/ImportScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  LessonsListScreen: {
    screen: LessonsListScreen,
    navigationOptions: { title: 'Lessons' }
  },
  LessonScreen: { screen: LessonScreen },
  AnkiScreen: { screen: AnkiScreen },
  PlaybackScreen: { screen: PlaybackScreen },
  ImportScreen: { screen: ImportScreen },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: { title: 'Login' }
  }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    header: {
      style: styles.header
    }
  }
})

export default PrimaryNav
