// /* global ErrorUtils:false */

import "../Config";
import DebugConfig from "../Config/DebugConfig";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { Platform } from "react-native";
import Sound from "react-native-sound";
// import RNFS from 'react-native-fs'

import { createAppContainer } from "react-navigation";
import TopLevelNavigator from "../Navigation/AppNavigation";
const AppContainer = createAppContainer(TopLevelNavigator);
import NavigationService from "../Services/NavigationService";

// Realm.copyBundledRealmFiles()
import { PersistGate } from "redux-persist/integration/react";

// import RootContainer from "./RootContainer";
// import { store, persistor } from "../Redux";
import createStore from "../Redux";
const { store, persistor } = createStore();
// const store = createStore();

import DatabaseProvider from "@nozbe/watermelondb/DatabaseProvider";
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { mySchema } from "../Models/schema";
import Sentence from "../Models/Sentence";
import Card from "../Models/Card";
import Lesson from "../Models/Lesson";
import LessonGroup from "../Models/LessonGroup";
import database from "../Models/database";

class App extends Component {
  componentWillMount() {
    if (Platform.OS === "android") {
      // RNFS.MainBundlePath is not supported for android so we have to copy the db to the documents folder
      // https://github.com/realm/realm-js/issues/1047
      // Realm.copyBundledRealmFiles() doesn't overwrite
      // RNFS.copyFileAssets('default.realm', RNFS.DocumentDirectoryPath + '/default.realm')
    }

    // Enable playback in silence mode (iOS only)
    Sound.setCategory("Playback", true);

    // Use instead?: react-native-exception-handler
    // Intercept react-native error handling
    // this.defaultHandler = ErrorUtils.getGlobalHandler()
    // ErrorUtils.setGlobalHandler(this.wrapGlobalHandler.bind(this))
  }

  // async wrapGlobalHandler (error, isFatal) {
  //   // If the error kills our app in Release mode, make sure we don't rehydrate
  //   // with an invalid Redux state and cleanly go back to login page instead
  //   // if (isFatal && !__DEV__) AsyncStorage.clear()
  //
  //   if (isFatal) console.error(error)
  //
  //   // Once finished, make sure react-native also gets the error
  //   if (this.defaultHandler) this.defaultHandler(error, isFatal)
  // }

  render() {
    return (
      <DatabaseProvider database={database}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppContainer
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </PersistGate>
        </Provider>
      </DatabaseProvider>
    );
  }
}

// allow reactotron overlay for fast design in dev mode
export default (DebugConfig.useReactotron ? console.tron.overlay(App) : App);
