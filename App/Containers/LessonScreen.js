// @flow

import React, { PureComponent } from "react";
import { View, ScrollView, Text } from "react-native";
import { connect } from "react-redux";
import { Card } from "react-native-elements";
import withObservables from "@nozbe/with-observables";
import { Icon } from "react-native-elements";
import { copilot, CopilotStep } from "@okgrow/react-native-copilot";

import LessonActions from "../Redux/LessonRedux";
import AppActions from "../Redux/AppRedux";
import RoundedButton from "../Components/RoundedButton";
import CopilotService from "../Services/Copilot";

// Styles
import styles from "./Styles/LessonScreenStyles";
import { Colors } from "../Themes/";

class WalkthroughableRoundedButton extends PureComponent {
  render() {
    return (
      <View {...this.props.copilot}>
        <RoundedButton {...this.props}>{this.props.children}</RoundedButton>
      </View>
    );
  }
}

class WalkthroughableNightIcon extends PureComponent {
  render() {
    return (
      <View style={styles.nightIconContainer}>
        <View {...this.props.copilot}>
          <Icon {...this.props} />
        </View>
      </View>
    );
  }
}

class LessonScreen extends React.Component {
  componentDidMount() {
    this.copilot = new CopilotService("lesson", this.props);
    this.copilot.start();
  }

  componentWillUnmount() {
    this.copilot.unload();
  }

  // componentWillReceiveProps(newProps) {
  //   if (
  //     this.state.modalVisible &&
  //     newProps.playerRunning !== this.props.playerRunning &&
  //     !newProps.playerRunning
  //   ) {
  //     // Audio finished, force the player to close since it's still open
  //     this.refs.nightPlayerModal.close();
  //   }
  // }

  renderCard() {
    const { lesson, startAnki } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Card
          title="Lesson Notes"
          containerStyle={{ flex: 1 }}
          wrapperStyle={{ flex: 1 }}
        >
          <ScrollView>
            <Text style={styles.componentLabel}>{lesson.note}</Text>
          </ScrollView>

          <CopilotStep
            text="Click here to start learning new vocabulary!"
            order={1}
            name="day"
          >
            <WalkthroughableRoundedButton
              onPress={() => startAnki()}
              styles={styles.button}
              testID="StartStudy"
            >
              START STUDY
            </WalkthroughableRoundedButton>
          </CopilotStep>
        </Card>

        <CopilotStep
          text="Click this button before going to sleep for a soothing audio recap! 😴"
          order={2}
          name="night"
        >
          <WalkthroughableNightIcon
            name="hotel"
            reverse
            raised
            color={Colors.easternBlue}
            size={25}
            onPress={() => this.startNight()}
            testID="StartNight"
          />
        </CopilotStep>
      </View>
    );
  }

  render() {
    return <View style={styles.mainContainer}>{this.renderCard()}</View>;
  }

  startNight() {
    const { navigation, lesson } = this.props;
    navigation.navigate("Player", { lesson });
  }
}

const mapStateToProps = state => {
  return {
    playerRunning: state.playback.playerRunning,
    copilotScreens: state.app.copilotScreens
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startAnki: () => dispatch(LessonActions.startAnki()),
    addCopilotScreen: screen => dispatch(AppActions.addCopilotScreen(screen))
  };
};

const enhance = withObservables([], ({ navigation }) => {
  const lesson = navigation.getParam("lesson");

  return {
    lesson: lesson.observe()
  };
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(enhance(copilot()(LessonScreen)));
