import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Platform } from 'react-native'
import Realm from 'realm'

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
      Realm.copyBundledRealmFiles()
    }
  }

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
