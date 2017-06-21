// /* global ErrorUtils:false */

import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Platform } from 'react-native'
import Realm from 'realm'
import Sound from 'react-native-sound'

// Realm.copyBundledRealmFiles()

import RootContainer from './RootContainer'
import createStore from '../Redux'

// create our store
const store = createStore()

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
  componentWillMount () {
    if (Platform.OS === 'android') {
      // RNFS.MainBundlePath is not working for android and I don't know how to referencee the bundle/asset path for
      // the readlm db...
      // todo: unlink dest files? (see rootcontainer git history) Or use fs.copyFileAssets to Doc dir
      // todo: remove realm from redux?
      Realm.copyBundledRealmFiles()
    }

    // Enable playback in silence mode (iOS only)
    Sound.setCategory('Playback', true)

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

  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
