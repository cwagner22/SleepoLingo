import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/LoginScreen'
import LessonsListScreen from '../Containers/LessonsListScreen'
import LessonScreen from '../Containers/LessonScreen'
import AnkiScreen from '../Containers/AnkiScreen'
import PlaybackScreen from '../Containers/PlaybackScreen'
import ImportScreen from '../Containers/ImportScreen'

import styles from './Styles/NavigationStyles'

export const Lessons = StackNavigator({
  LessonsListScreen: {
    screen: LessonsListScreen,
    navigationOptions: {title: 'Lessons'}
  },
  LessonScreen: {
    screen: LessonScreen,
    navigationOptions: ({navigation}) => ({
      // title: navigation.state.params.lesson.name,
      title: navigation.state.params && navigation.state.params.title,
      headerBackTitle: 'Back'
    })
  },
  AnkiScreen: {
    screen: AnkiScreen,
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params && navigation.state.params.title
    })
  },
  PlaybackScreen: {
    screen: PlaybackScreen
  }
}, {
  // cardStyle: {
  //   opacity: 1,
  //   backgroundColor: '#3e243f'
  // },
  // initialRouteName: 'PresentationScreen',
  // headerMode: 'none',
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
  initialRouteName: 'LaunchScreen',
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
