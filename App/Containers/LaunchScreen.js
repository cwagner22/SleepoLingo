import React from "react";
import { ScrollView, Text, Image, View } from "react-native";
import { connect } from "react-redux";

// import DevscreensButton from "../../ignite/DevScreens/DevscreensButton.js";
import RoundedButton from "../Components/RoundedButton";
import NavigationActions from "../Navigation/NavigationActions";

import { Images } from "../Themes";

// Styles
import styles from "./Styles/LaunchScreenStyles";

export default class LaunchScreen extends React.Component {
  openLessonsList = () => {
    this.props.navigateToLessons();
  };

  openImport = () => {
    this.props.navigation.navigate("ImportScreen");
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Image
          source={Images.background}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={styles.section}>
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              This probably isn't what your app is going to look like. Unless
              your designer handed you this screen and, in that case, congrats!
              You're ready to ship. For everyone else, this is where you'll see
              a live preview of your fully functioning app using Ignite.
            </Text>
          </View>

          <RoundedButton
            onPress={() => this.props.navigation.navigate("LessonsList")}
          >
            Lessons
          </RoundedButton>

          <RoundedButton onPress={this.openImport}>Import</RoundedButton>

          {/* <DevscreensButton /> */}
        </ScrollView>
      </View>
    );
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     navigateToLessons: () => dispatch(NavigationActions.navigate("LessonsList"))
//   };
// };

// export default connect(
//   null,
//   mapDispatchToProps
// )(LaunchScreen);
