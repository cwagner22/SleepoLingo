import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import { connect } from "react-redux";
import { Platform } from "react-native";
import Sound from "react-native-sound";

import AppContainer from "../Navigation/AppNavigation";
import NavigationService from "../Services/NavigationService";
import ImportActions from "../Redux/ImportRedux";

// Styles
import styles from "./Styles/RootContainerStyles";

class RootContainer extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === "android") {
      // RNFS.MainBundlePath is not supported for android so we have to copy the db to the documents folder
      // https://github.com/realm/realm-js/issues/1047
      // Realm.copyBundledRealmFiles() doesn't overwrite
      // RNFS.copyFileAssets('default.realm', RNFS.DocumentDirectoryPath + '/default.realm')
    }

    // Enable playback in silence mode (iOS only)
    Sound.setCategory("Playback", true);
  }
  componentDidMount() {
    // Import the lessons to the Watermelon database if first launch or updated
    // this.props.importLessons();
  }

  render() {
    return (
      <View style={styles.applicationView}>
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </View>
    );
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
  importLessons: () => dispatch(ImportActions.importLessons())
});

export default connect(
  null,
  mapDispatchToProps
)(RootContainer);
