// @flow

import React from "react";
import { View, ScrollView, Text } from "react-native";
import { connect } from "react-redux";
import { Card } from "react-native-elements";
import ActionButton from "react-native-action-button";
import Modal from "react-native-modalbox";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import withObservables from "@nozbe/with-observables";

import LessonActions from "../Redux/LessonRedux";
import RoundedButton from "../Components/RoundedButton";
import PlayerScreen from "./Player/PlayerScreen";
import LessonTitle from "./LessonTitle";

// Styles
import styles from "./Styles/LessonScreenStyles";
import { Colors } from "../Themes/";

class LessonScreen extends React.Component {
  state = {
    modalVisible: false
  };

  constructor(props) {
    super(props);
    props.downloadLesson(props.cards);
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

    if (!this.state.modalVisible) {
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
            <View>
              <RoundedButton onPress={() => startAnki()} styles={styles.button}>
                START STUDY
              </RoundedButton>
            </View>
          </Card>

          <ActionButton
            buttonColor={Colors.easternBlue}
            onPress={() => this.startNight()}
            offsetY={85}
            renderIcon={() => <MIcon name="hotel" color="white" size={24} />}
            elevation={5}
            zIndex={5}
          />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.renderCard()}

        <Modal
          style={styles.mainContainer}
          ref={"nightPlayerModal"}
          swipeToClose
          entry="top"
          onClosed={() => this.onPlayerClose()}
          backdropOpacity={0.95}
          // swipeArea={Dimensions.get('window').height*0.65}
        >
          <PlayerScreen />
        </Modal>
      </View>
    );
  }

  onPlayerClose() {
    // this.props.navigation.setOptions({
    //   header: undefined, // Default header
    //   gesturesEnabled: Platform.OS === 'ios'
    // })
    this.props.navigation.setParams({
      modalVisible: false
    });
    this.setState({ modalVisible: false });
  }

  startNight() {
    // this.props.navigation.setOptions({
    //   header: null,
    //   gesturesEnabled: false
    // })
    this.props.navigation.setParams({
      modalVisible: true
    });
    this.setState({ modalVisible: true });
    this.refs.nightPlayerModal.open();
  }
}

const mapStateToProps = state => {
  return {
    // lesson: Lesson.getFromId(state.lesson.currentLessonId, true),
    playerRunning: state.playback.playerRunning
  };
};

const mapDispatchToProps = dispatch => {
  return {
    downloadLesson: words => dispatch(LessonActions.downloadLesson(words)),
    startAnki: () => dispatch(LessonActions.startAnki())
  };
};

const enhance = withObservables([], ({ navigation }) => {
  // console.log(lesson);
  const lesson = navigation.getParam("lesson");

  return {
    lesson: lesson.observe(),
    cards: lesson.cards.observe()
  };
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(enhance(LessonScreen));
