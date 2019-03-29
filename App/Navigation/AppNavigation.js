import React from "react";
import { Button, Dimensions, Platform, Animated, Easing } from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer,
  StackViewTransitionConfigs
} from "react-navigation";

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
    }
  },
  {
    defaultNavigationOptions: {
      ...headerColors
    }
  }
);

const transitionConfig = (transitionProps, prevTransitionProps) => {
  const last = transitionProps.scenes[transitionProps.scenes.length - 1];
  if (last.route.routeName === "Player") {
    // Custom slide from top transition
    return {
      transitionSpec: {
        duration: 750,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true
      },
      screenInterpolator: sceneProps => {
        const { position, layout, scene } = sceneProps;
        const thisSceneIndex = scene.index;
        const height = layout.initHeight;

        const translateY = position.interpolate({
          inputRange: [thisSceneIndex - 1, thisSceneIndex],
          outputRange: [-height, 0]
        });
        const slideFromTop = { transform: [{ translateY }] };

        return slideFromTop;
      }
    };
  }

  // Default modal transition
  return StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    true
  );
};

// Use a stack navigator wrapper to handle the modals: https://reactnavigation.org/docs/en/modal.html
// Not sure why we need to put lessons inside it and not in the drawer...
// Info about dynamic mode: https://reactnavigation.org/docs/en/stack-navigator.html#specifying-the-transition-mode-for-a-stack-s-screens-explicitly
const ModalStack = createStackNavigator(
  {
    Main: { screen: LessonsStack },
    Player: {
      screen: PlayerScreen,
      navigationOptions: () => ({
        gesturesEnabled: true,
        gestureResponseDistance: {
          vertical: Dimensions.get("window").height * 0.7
        },
        gestureDirection: "inverted"
      })
    },
    // Another stack navigator to have a header as well...
    PlayerSettingsStack: createStackNavigator({
      PlayerSettings: {
        screen: PlayerSettingsScreen,
        navigationOptions: ({ navigation }) => ({
          title: "Settings",
          headerRight:
            Platform.OS === "ios" ? (
              <Button
                onPress={() => navigation.pop()}
                title="Done"
                color={Colors.cheeryPink}
              />
            ) : null
        })
      }
    })
  },
  {
    mode: "modal",
    headerMode: "none",
    transitionConfig
  }
);

// https://reactnavigation.org/docs/en/navigation-options-resolution.html#a-drawer-has-a-stack-inside-of-it-and-you-want-to-lock-the-drawer-on-certain-screens
ModalStack.navigationOptions = ({ navigation }) => {
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
    Main: ModalStack,
    // SettingsStack: createStackNavigator(
    //   {
    //     Settings: {
    //       screen: SettingsScreen,
    //       navigationOptions: ({ navigation }) => ({
    //         headerLeft: <DrawerButton navigation={navigation} />
    //       })
    //     }
    //   },
    //   {
    //     defaultNavigationOptions: {
    //       title: "Settings",
    //       ...headerColors
    //     },
    //     navigationOptions: () => ({
    //       drawerLabel: "Settings"
    //     })
    //   }
    // ),
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
