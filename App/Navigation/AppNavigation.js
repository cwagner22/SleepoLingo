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
import NavigationService from "../Services/NavigationService";

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

let CollapseExpand = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1]
  });

  const scaleY = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1]
  });

  return {
    opacity,
    transform: [{ scaleY }]
  };
};

let SlideFromRight = (index, position, width) => {
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0]
  });
  return { transform: [{ translateX }] };
};

let SlideFromTop = (index, position, height) => {
  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 0.01, index + 1],
    outputRange: [1, 1, 0.5, 0]
  });
  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [-height, 0, 0]
  });

  return { transform: [{ translateY }], opacity };
};

let Opacity = (index, position, height) => {
  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 0.01, index + 1],
    outputRange: [1, 1, 0.5, 0]
  });
  return { opacity };
};

// https://medium.com/@ksashrithbhat/custom-transitions-in-react-navigation-screen-to-screen-c2d035aa3c63
const transitionConfig = (transitionProps, prevTransitionProps) => {
  const routeName = NavigationService.getActiveRouteName(
    transitionProps.navigation.state
  );

  // const lastScene = transitionProps.scenes[transitionProps.scenes.length - 1];
  if (routeName === "Player") {
    // Custom slide from top transition
    return {
      transitionSpec: {
        duration: 750,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true
      },
      screenInterpolator: sceneProps => {
        // screenInterpolator() is called for each scene.
        // Initially scene is the route we’re navigating from.
        // Immediately after this, screenInterpolator(sceneProps) will be called again and scene
        // will be the route we’re navigating to.
        // screenInterpolator gets called again after the transition completes but it’s probably
        // due to a re - render within React Navigation due to the change in navigation props.
        const { position, layout, scene } = sceneProps;
        const { index, route } = scene;
        const height = layout.initHeight;
        const width = layout.initHeight;

        // const lastRoute = getLastRoute(scene);
        // console.log("scene", scene, "route", route, "lastRoute", lastRoute);

        // const opacity = position.interpolate({
        //   inputRange: [
        //     thisSceneIndex - 1,
        //     thisSceneIndex,
        //     thisSceneIndex + 0.01,
        //     thisSceneIndex + 1
        //   ],
        //   outputRange: [1, 1, 0.5, 0]
        // });

        // if (route.routeName === "Player") {
        return SlideFromTop(index, position, height);
        // return Opacity(index, position, height);
        // } else {
        // return SlideFromRight(index, position, width);
        // }

        // const transition = route.routeName || "default";
        // return {
        //   collapseExpand: CollapseExpand(index, position),
        //   default: SlideFromRight(index, position, width)
        // }[transition];

        // return slideFromTop;
      },
      containerStyle: {
        backgroundColor: "#000000"
      }
    };
  }

  // Default modal transition
  let config = StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    true
  );
  // if (routeName === "Lesson") {
  // config.containerStyle.backgroundColor = "#000000";
  // }
  console.log(config);

  return config;
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
