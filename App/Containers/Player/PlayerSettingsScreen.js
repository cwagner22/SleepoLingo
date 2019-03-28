// @flow

import React from "react";
import { Button, StatusBar, Platform } from "react-native";
import { connect } from "react-redux";
import DialogAndroid from "react-native-dialogs";
import Picker from "react-native-picker";
import {
  Container,
  Content,
  List,
  ListItem,
  Body,
  Switch,
  Right,
  Text,
  Icon,
  Separator
} from "native-base";

import PlaybackActions from "../../Redux/PlaybackRedux";

// Styles
import styles from "../Styles/PlayerSettingsScreenStyle";

class PlayerSettingsScreen extends React.Component {
  state = { controlOS: false };

  componentWillMount() {
    StatusBar.setBarStyle("dark-content");
  }

  componentWillUnmount() {
    StatusBar.setBarStyle("light-content");
  }

  // setControlOS (val) {
  //   this.setState({controlOS: val})
  //   this.props.setControlOS(val)
  // }

  onNumberOfRepeatsSelect(selectedIndex, selectedItem) {
    this.props.loopMaxChange(selectedIndex + 1);
  }

  openNumberOfRepeats() {
    const items = [
      "1 time",
      "2 times",
      "3 times",
      "4 times",
      "5 times",
      "6 times"
    ];

    if (Platform.OS === "ios") {
      Picker.init({
        pickerCancelBtnText: "Cancel",
        pickerConfirmBtnText: "Done",
        pickerTitleText: "Repeat",
        pickerData: items,
        selectedValue: [items[this.props.lessonLoopMax - 1]],
        onPickerConfirm: data => {
          if (data) {
            this.onNumberOfRepeatsSelect(items.indexOf(data[0]));
          }
        }
      });
      Picker.show();
    } else {
      var options = {
        title: "Number Of Lesson Repeats",
        items: items,
        itemsCallbackSingleChoice: this.onNumberOfRepeatsSelect.bind(this),
        selectedIndex: this.props.lessonLoopMax - 1,
        negativeText: "Cancel"
      };

      var dialog = new DialogAndroid();
      dialog.set(options);
      dialog.show();
    }
  }

  render() {
    return (
      <Container style={styles.mainContainer}>
        <Content>
          <List style={styles.list}>
            <Separator style={styles.header}>
              <Text style={styles.headerText} uppercase={Platform.OS === "ios"}>
                Player
              </Text>
            </Separator>
            <ListItem onPress={() => {}}>
              <Text>Control Player From OS</Text>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem>
            {Platform.OS === "ios" ? (
              <ListItem last icon onPress={() => this.openNumberOfRepeats()}>
                <Body>
                  <Text>Number Of Repeats</Text>
                </Body>
                <Right>
                  <Text>{this.props.lessonLoopMax}</Text>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            ) : (
              <ListItem last onPress={() => this.openNumberOfRepeats()}>
                <Body style={styles.bodyMulti}>
                  <Text>Number Of Repeats</Text>
                  <Text note>{`Repeat the lesson ${
                    this.props.lessonLoopMax
                  } times`}</Text>
                </Body>
              </ListItem>
            )}
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    controlOS: state.playback.controlOS,
    lessonLoopMax: state.playback.lessonLoopMax
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeLoopMax: val => dispatch(PlaybackActions.playbackLoopMaxChange(val)),
    setControlOS: val => dispatch(PlaybackActions.playbackSetControlOS(val)),
    loopMaxChange: val => dispatch(PlaybackActions.playbackLoopMaxChange(val))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerSettingsScreen);
