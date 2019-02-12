import React from "react";
import { Button } from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer,
  HeaderBackButton
} from "react-navigation";

// import LaunchScreen from "../Containers/LaunchScreen";
import LessonsListScreen from "../Containers/LessonsListScreen";
import LessonScreen from "../Containers/LessonScreen";
import AnkiScreen from "../Containers/Anki/AnkiScreen";
import ImportScreen from "../Containers/ImportScreen/ImportScreen";
// import WordsListScreen from "../Containers/WordsListScreen";
import DrawerButton from "../Components/DrawerButton";
import SettingsScreen from "../Containers/SettingsScreen";
import ContactScreen from "../Containers/ContactScreen";
import PlayerSettingsScreen from "../Containers/PlayerSettingsScreen";

import styles from "./Styles/NavigationStyles";
import { Colors } from "../Themes/";

// To be able to use modals with cards we have to wrap the cards stack inside a modal stack
// https://github.com/react-community/react-navigation/issues/707#issuecomment-299859578
const MainCardStack = createStackNavigator(
  {
    LessonsListScreen: {
      screen: LessonsListScreen,
      navigationOptions: ({ navigation }) => ({
        title: "SleepoLingo",
        headerTitleStyle: styles.bigHeaderTitle,
        titleStyle: styles.bigHeader,
        headerLeft: <DrawerButton navigation={navigation} />,
        headerBackTitle: "Lessons",
        drawerLockMode: "unlocked"
      })
    },
    LessonScreen: {
      screen: LessonScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("lesson").name,
        // Hide header when modal visible
        header: navigation.getParam("modalVisible") ? null : undefined,
        headerBackTitle: "Back"
      })
    },
    AnkiScreen: {
      screen: AnkiScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("lesson").name,
        headerRight: (
          <Button onPress={() => params.navigateToWords()} title="All Words" />
        )
      })
    }
    // WordsListScreen: {
    //   screen: WordsListScreen,
    //   navigationOptions: ({ navigation }) => ({
    //     title: "Words"
    //     // headerBackTitle: 'Back'
    //   })
    // }
  },
  {
    // headerMode: "none"
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: "locked-closed"
    })
  }
);

// Modals + Main StackNavigator
const MainModalStack = createStackNavigator(
  {
    LessonsListScreen: {
      screen: MainCardStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    }
    // PlayerSettingsScreen: {
    //   screen: PlayerSettingsScreen,
    //   navigationOptions: ({ navigation }) => ({
    //     drawerLockMode: "locked-closed"
    //   })
    // }
    // // PlayerScreen: {
    // //   screen: PlayerScreen,
    // //   navigationOptions: () => ({
    // //     header: null
    // //   })
    // // }
  },
  {
    mode: "modal",
    // Keep drawer locked by default, unlock it in the LessonsListScreen
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: "locked-closed"
    })
  }
);

const Drawer = createDrawerNavigator(
  {
    LessonsList: {
      screen: MainModalStack,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "Lessons",
        drawerLockMode: "unlocked"
      })
    },
    Settings: {
      screen: createStackNavigator({
        SettingsScreen: {
          screen: SettingsScreen
          // navigationOptions: ({ navigation }) => ({
          //   drawerLabel: "Settings",
          //   title: "Settings",
          //   headerLeft: <DrawerButton navigation={navigation} />
          // })
        }
      })
    },
    Contact: {
      screen: createStackNavigator({
        ContactScreen: {
          screen: ContactScreen
          // navigationOptions: ({ navigation }) => ({
          //   drawerLabel: "Contact",
          //   title: "Contact",
          //   headerLeft: <DrawerButton navigation={navigation} />
          // })
        }
      })
    }
  },
  {
    contentOptions: {
      activeTintColor: Colors.cheeryPink
    }
  }
);

// const forceDevScreen = "ImportScreen";
const forceDevScreen = "LessonsList";
// const PrimaryNav = createStackNavigator(
//   {
//     // LaunchScreen: { screen: LaunchScreen },
//     LessonsList: {
//       screen: Drawer
//     },
//     ImportScreen: {
//       screen: ImportScreen
//     }
//   },
//   {
//     // Default config for all screens
//     headerMode: "none",
//     initialRouteName: __DEV__ ? forceDevScreen : "LessonsList"
//     // navigationOptions: {
//     //   header: {
//     //     style: styles.header
//     //   }
//     // }
//   }
// );

export default createAppContainer(Drawer);
