// /* global ErrorUtils:false */

import "../Config";
import DebugConfig from "../Config/DebugConfig";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { Platform } from "react-native";
import Sound from "react-native-sound";
// import RNFS from 'react-native-fs'

// Realm.copyBundledRealmFiles()

import RootContainer from "./RootContainer";
import createStore from "../Redux";

import DatabaseProvider from "@nozbe/watermelondb/DatabaseProvider";
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { mySchema } from "../Models/schema";
import Sentence from "../Models/Sentence";
import Card from "../Models/Card";
import Lesson from "../Models/Lesson";
import LessonGroup from "../Models/LessonGroup";

// create our store
const store = createStore();

// set up the database
const adapter = new SQLiteAdapter({
  dbName: "SleepoLingo",
  schema: mySchema
});

const database = new Database({
  adapter,
  modelClasses: [Sentence, Card, Lesson, LessonGroup]
});

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
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
          <RootContainer />
        </Provider>
      </DatabaseProvider>
    );
  }
}

// allow reactotron overlay for fast design in dev mode
export default (DebugConfig.useReactotron ? console.tron.overlay(App) : App);
