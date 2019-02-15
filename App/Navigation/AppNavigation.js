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
import WordsListScreen from "../Containers/Anki/WordsListScreen";
import DrawerButton from "../Components/DrawerButton";
import SettingsScreen from "../Containers/SettingsScreen";
import ContactScreen from "../Containers/ContactScreen";
import PlayerSettingsScreen from "../Containers/Player/PlayerSettingsScreen";
import PlayerScreen from "../Containers/Player/PlayerScreen";

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
        headerBackTitle: "Back"
      })
    },
    AnkiScreen: {
      screen: AnkiScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("lesson").name,
        headerRight: (
          <Button
            onPress={() =>
              navigation.navigate("WordsListScreen", {
                cards: navigation.getParam("cards")
              })
            }
            title="All Words"
          />
        )
      })
    },
    WordsListScreen: {
      screen: WordsListScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Words"
        // headerBackTitle: 'Back'
      })
    }
  },
  {
    // headerMode: "none"
    defaultNavigationOptions: {
      headerBackTitleStyle: {
        color: Colors.cheeryPink
      },
      headerTintColor: Colors.cheeryPink,
      drawerLockMode: "locked-closed"
    }
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
    },
    PlayerSettingsScreen: {
      screen: PlayerSettingsScreen,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: "locked-closed"
      })
    },
    PlayerScreen: {
      screen: PlayerScreen,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    mode: "modal",
    // Keep drawer locked by default, unlock it in the LessonsListScreen
    defaultNavigationOptions: {
      drawerLockMode: "locked-closed"
    }
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
    },
    ImportScreen: {
      screen: ImportScreen
    }
  },
  {
    contentOptions: {
      activeTintColor: Colors.cheeryPink
    }
  }
);

export default createAppContainer(Drawer);
