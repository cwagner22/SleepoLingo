// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import RNFS from 'react-native-fs'

import NavigationRouter from '../Navigation/NavigationRouter'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

// Styles
import styles from './Styles/RootContainerStyle'

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }

    console.log('unlink')
    RNFS.unlink(RNFS.DocumentDirectoryPath + '/db.realm.lock')
    RNFS.unlink(RNFS.DocumentDirectoryPath + '/db.realm.management')
    RNFS.unlink(RNFS.DocumentDirectoryPath + '/db.realm')
    // RNFS.moveFile(RNFS.MainBundlePath+"/db.realm", RNFS.DocumentDirectoryPath+"/db.realm")
    RNFS.copyFile(RNFS.MainBundlePath + '/db.realm', RNFS.DocumentDirectoryPath + '/db.realm')
      .then((success) => {
        // Realm.copyBundledRealmFiles()
        console.log('copyBundledRealmFiles')
        // console.log(realm.path, RNFS.DocumentDirectoryPath);
        // return realm
        // realm = new Realm({
        //   // path: 'newDefault.realm',
        //   schema: [{name: 'Dog', properties: {name: 'string'}}]
        // });
        // this.setState({realm: realm});
        // return realm;
      })
      .catch((err) => {
        console.log(err.message)
      })
    // Realm.copyBundledRealmFiles()
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <NavigationRouter />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
