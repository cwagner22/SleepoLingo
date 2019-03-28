// @flow

import React from "react";
import { View, ScrollView, Text } from "react-native";
import { connect } from "react-redux";
import { Card } from "react-native-elements";
import ActionButton from "react-native-action-button";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import withObservables from "@nozbe/with-observables";

import LessonActions from "../Redux/LessonRedux";
import RoundedButton from "../Components/RoundedButton";

// Styles
import styles from "./Styles/LessonScreenStyles";
import { Colors } from "../Themes/";

class LessonScreen extends React.Component {
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

          <RoundedButton
            onPress={() => startAnki()}
            styles={styles.button}
            testID="StartStudy"
          >
            START STUDY
          </RoundedButton>
        </Card>

        <ActionButton
          buttonColor={Colors.easternBlue}
          onPress={() => this.startNight()}
          offsetY={85}
          renderIcon={() => <MIcon name="hotel" color="white" size={24} />}
          elevation={5}
          zIndex={5}
          testID="StartNight"
        />
      </View>
    );
  }

  render() {
    // const { cards } = this.props;
    return <View style={styles.mainContainer}>{this.renderCard()}</View>;
  }

  startNight() {
    const { navigation, lesson } = this.props;
    navigation.navigate("Player", { lesson });
  }
}

const mapStateToProps = state => {
  return {
    playerRunning: state.playback.playerRunning
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startAnki: () => dispatch(LessonActions.startAnki())
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
)(enhance(LessonScreen));
