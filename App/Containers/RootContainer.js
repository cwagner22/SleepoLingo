import React, { Component } from "react";
import { View, StatusBar, BackHandler } from "react-native";
import { connect } from "react-redux";
import { NavigationActions, addNavigationHelpers } from "react-navigation";
import ReduxNavigation from "../Navigation/ReduxNavigation";

import Navigation from "../Navigation/AppNavigation";
// import StartupActions from "../Redux/StartupRedux";
// import ReduxPersist from "../Config/ReduxPersist";

// Styles
import styles from "./Styles/RootContainerStyles";

class RootContainer extends Component {
  // constructor(props) {
  //   super(props);
  //   console.log('copy');
  //   Realm.copyBundledRealmFiles();
  // }

  componentDidMount() {
    // if redux persist is not active fire startup action
    // if (!ReduxPersist.active) {
    //   this.props.startup();
    // }
    // BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  // }

  // hasNavigated = nav => {
  //   if (nav.index > 0) return true;

  //   if (nav.routes) {
  //     for (var i = 0; i < nav.routes.length; i++) {
  //       if (this.hasNavigated(nav.routes[i])) return true;
  //     }
  //   }

  //   return false;
  // };

  // onBackPress = () => {
  //   const { dispatch, nav } = this.props;
  //   if (!this.hasNavigated(nav)) {
  //     // Close app
  //     return false;
  //   }
  //   dispatch(NavigationActions.back());
  //   return true;
  // };

  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle="default" />
        <ReduxNavigation />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // nav: state.nav
  // settings: {currentLessonId: state.lesson.currentLessonId}
});

// wraps dispatch to create nicer functions to call within our component
// const mapDispatchToProps = dispatch => ({
//   startup: () => dispatch(StartupActions.startup()),
//   dispatch
// });

export default connect(mapStateToProps)(RootContainer);
