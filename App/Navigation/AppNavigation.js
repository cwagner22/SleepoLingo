import React from "react";
import { Button } from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
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

const headerColors = {
  titleStyle: {
    color: Colors.cheeryPink
  },
  headerTintColor: Colors.cheeryPink
};

const LessonsStack = createStackNavigator(
  {
    LessonsList: {
      screen: LessonsListScreen,
      navigationOptions: ({ navigation }) => ({
        title: "SleepoLingo",
        headerTitleStyle: styles.headerTitle,
        titleStyle: styles.header,
        headerLeft: <DrawerButton navigation={navigation} />,
        headerBackTitle: "Lessons"
      })
    },
    Lesson: {
      screen: LessonScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("lesson").name,
        headerBackTitle: "Back"
      })
    },
    Anki: {
      screen: AnkiScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("lesson").name,
        headerRight: (
          <Button
            onPress={() =>
              navigation.navigate("WordsList", {
                lesson: navigation.getParam("lesson")
              })
            }
            title="All Words"
            color={Colors.cheeryPink}
          />
        )
      })
    },
    WordsList: {
      screen: WordsListScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Words"
        // headerBackTitle: 'Back'
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
    defaultNavigationOptions: {
      ...headerColors
    }
  }
);

// https://reactnavigation.org/docs/en/navigation-options-resolution.html#a-drawer-has-a-stack-inside-of-it-and-you-want-to-lock-the-drawer-on-certain-screens
LessonsStack.navigationOptions = ({ navigation }) => {
  let drawerLockMode = "unlocked";
  if (navigation.state.index > 0) {
    drawerLockMode = "locked-closed";
  }

  return {
    drawerLockMode
  };
};

const DrawerNavigator = createDrawerNavigator(
  {
    Lessons: LessonsStack,
    SettingsStack: createStackNavigator(
      {
        Settings: {
          screen: SettingsScreen,
          navigationOptions: ({ navigation }) => ({
            headerLeft: <DrawerButton navigation={navigation} />
          })
        }
      },
      {
        defaultNavigationOptions: {
          title: "Settings",
          ...headerColors
        },
        navigationOptions: () => ({
          drawerLabel: "Settings"
        })
      }
    ),
    ContactStack: createStackNavigator(
      {
        Settings: {
          screen: ContactScreen,
          navigationOptions: ({ navigation }) => ({
            headerLeft: <DrawerButton navigation={navigation} />
          })
        }
      },
      {
        defaultNavigationOptions: {
          title: "Contact",
          ...headerColors
        },
        navigationOptions: () => ({
          drawerLabel: "Contact"
        })
      }
    ),
    ...(__DEV__ && {
      ImportStack: createStackNavigator(
        {
          Import: {
            screen: ImportScreen,
            navigationOptions: ({ navigation }) => ({
              headerLeft: <DrawerButton navigation={navigation} />
            })
          }
        },
        {
          defaultNavigationOptions: {
            title: "Import",
            ...headerColors
          },
          navigationOptions: () => ({
            drawerLabel: "Import"
          })
        }
      )
    })
  },
  {
    contentOptions: {
      activeTintColor: Colors.cheeryPink
    }
  }
);

export default createAppContainer(DrawerNavigator);
