// @flow

import React from "react";
import { View, ScrollView, Text, Platform } from "react-native";
import { connect } from "react-redux";
import { Card } from "react-native-elements";
import ActionButton from "react-native-action-button";
import Modal from "react-native-modalbox";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

import LessonActions from "../Redux/LessonRedux";
import RoundedButton from "../Components/RoundedButton";
import PlayerScreen from "./PlayerScreen";
import LessonTitle from "./LessonTitle";

// Styles
import styles from "./Styles/LessonScreenStyles";
import { Colors } from "../Themes/";

class LessonScreen extends React.Component {
  state = {
    modalVisible: false
  };

  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;

    return {
      // Use a custom component to display the lesson name. Setting it in
      // componentWillMount with setOptions/setParams causes some delay, maybe because of redux
      headerTitle: <LessonTitle />,
      // Hide header when modal visible
      header: params.modalVisible ? null : undefined,
      gesturesEnabled: !params.modalVisible && Platform.OS === "ios",
      headerBackTitle: "Back"
    };
  };

  componentWillMount() {
    const { lesson } = this.props;
    // this.props.navigation.setOptions({
    //   // title: lesson.name,
    //   // gesturesEnabled: Platform.OS === 'ios',
    //   headerBackTitle: 'Back'
    // })

    this.props.downloadLesson(lesson.cards);
  }

  componentWillReceiveProps(newProps) {
    if (
      this.state.modalVisible &&
      newProps.playerRunning !== this.props.playerRunning &&
      !newProps.playerRunning
    ) {
      // Audio finished, force the player to close since it's still open
      this.refs.nightPlayerModal.close();
    }
  }

  renderCard() {
    if (!this.state.modalVisible) {
      const { lesson } = this.props.navigation.getParam("lesson");

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
              <RoundedButton
                onPress={() => this.startDay()}
                styles={styles.button}
              >
                START STUDY
              </RoundedButton>
            </View>
          </Card>

          {/*        <Fab
            // active={this.state.active}
            // direction='up'
            containerStyle={{ bottom: 80, right: 30 }}
            style={{ backgroundColor: Colors.easternBlue }}
            position='bottomRight'
            onPress={() => this.startNight()}>
            <MIcon name='hotel' color='white' size={24} />
          </Fab> */}

          <ActionButton
            buttonColor={Colors.easternBlue}
            onPress={() => this.startNight()}
            offsetY={85}
            icon={<MIcon name="hotel" color="white" size={24} />}
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

  startDay() {
    this.props.startAnki();
    // this.props.navigation.navigate('AnkiScreen', {title: this.props.lesson.name})
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
    lesson: Lesson.getFromId(state.lesson.currentLessonId, true),
    playerRunning: state.playback.playerRunning
  };
};

const mapDispatchToProps = dispatch => {
  return {
    downloadLesson: words => dispatch(LessonActions.downloadLesson(words)),
    startAnki: () => dispatch(LessonActions.lessonStartAnki())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LessonScreen);
