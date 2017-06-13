import { StackNavigator } from 'react-navigation'
import { enhance } from './react-navigation-addons'

import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/LoginScreen'
import LessonsListScreen from '../Containers/LessonsListScreen'
import LessonScreen from '../Containers/LessonScreen'
import AnkiScreen from '../Containers/AnkiScreen'
import PlayerScreen from '../Containers/PlayerScreen'
import ImportScreen from '../Containers/ImportScreen'
import WordsListScreen from '../Containers/WordsListScreen'

import styles from './Styles/NavigationStyles'

// Use react-navigation-addons for the setOptions feature
export const Lessons = enhance(StackNavigator)({
  LessonsListScreen: {
    screen: LessonsListScreen
  },
  LessonScreen: {
    screen: LessonScreen
  },
  AnkiScreen: {
    screen: AnkiScreen
    // navigationOptions: ({navigation}) => ({
    //   title: navigation.state.params && navigation.state.params.title,
    //   headerRight: (
    //     <Text>All Words</Text>
    //   )
    // })
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
  // cardStyle: {
  //   opacity: 1,
  //   backgroundColor: '#3e243f'
  // },
  // initialRouteName: 'PresentationScreen',
  // headerMode: 'none',
  // headerMode: 'screen',
  // // Keeping this here for future when we can make
  navigationOptions: {
    // header: {
    //   // left: (
    //   //   <TouchableOpacity onPress={() => window.alert('pop')}><Image source={Images.closeButton}
    //   //     style={{marginHorizontal: 10}} /></TouchableOpacity>
    //   // ),
    //   style: styles.header
    // },
    // headerStyle: styles.header,
    // headerTitleStyle: styles.headerTitle,
    // headerBackTitleStyle: styles.headerTitle,
    // headerTintColor: '#fff',
  }
})

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: {screen: LaunchScreen},
  LessonsListScreen: {
    screen: Lessons
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
  initialRouteName: __DEV__ ? 'LaunchScreen' : 'LessonsListScreen',
  navigationOptions: {
    header: {
      style: styles.header
    }
  }
})

export default PrimaryNav

export const reducer = (state, action) => {
  const newState = PrimaryNav.router.getStateForAction(action, state)
  return newState || state
}
