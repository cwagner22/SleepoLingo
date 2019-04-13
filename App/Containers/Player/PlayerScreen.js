// @flow

import React from "react";
import { View, Text, StatusBar } from "react-native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import withObservables from "@nozbe/with-observables";
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import { of as of$ } from "rxjs";

import PlaybackControls from "./PlayerControls";
import PlayerProgress from "./PlayerProgress";
import LessonActions from "../../Redux/LessonRedux";
import VolumeSlider from "../../Components/VolumeSlider";
import PlaybackActions from "../../Redux/PlaybackRedux";
import { isFocusMode } from "../../Sagas/PlaybackSagas";

// Styles
import styles from "../Styles/PlayerScreenStyle";

class PlayerScreen extends React.Component {
  componentWillMount() {
    StatusBar.setBarStyle("light-content");
    this.props.startNight();
    // this.scheduleTimer()
  }

  componentWillUnmount() {
    StatusBar.setBarStyle("dark-content");
    this.props.playerStop();
  }

  scheduleTimer() {
    // todo
    BackgroundTimer.setTimeout(() => {
      // this.componentWillUnmount();
      this.props.navigation.back();
    }, 60 * 60 * 1000);
  }

  renderWord() {
    const sentence = this.props.card.getSentence();
    const sentenceStr =
      this.props.playingState === "ORIGINAL"
        ? sentence.original
        : sentence.translation;
    return (
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentence}>{sentenceStr}</Text>
      </View>
    );
  }

  renderInfoText() {
    const text = isFocusMode()
      ? "Focus on the audio lesson until the end"
      : "Good night. Playing the lesson one more time so you can listen while drifting off";

    return <Text style={styles.infoText}>{text}</Text>;
  }

  renderStop() {
    return (
      <View style={styles.stop} testID="StopPlayer">
        <Icon iconStyle={styles.stopIcon} name="keyboard-arrow-up" />
        <Text style={styles.stopText}>STOP</Text>
        {this.renderInfoText()}
      </View>
    );
  }

  render() {
    const { card, cardsCount } = this.props;
    // const bgStyle = {
    // backgroundColor: isFocusMode() ? '#0e1a29' : '#0c0f1c'
    // }

    return (
      // 09203f
      <LinearGradient
        colors={["#0c0f1c", "#0e1a29"]}
        style={styles.mainContainer}
      >
        {card && this.renderWord()}
        {this.renderStop()}
        <VolumeSlider
          volume={this.props.volume}
          onChange={volume => this.props.changeVol(volume)}
        />
        {card && cardsCount && (
          <PlayerProgress card={card} cardsCount={cardsCount} />
        )}
        <PlaybackControls />
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => {
  return {
    isPaused: state.playback.isPaused,
    playingState: state.playback.playingState,
    volume: state.playback.volume,
    currentCardId: state.lesson.currentCardId,
    cardsCount: state.playback.cardsCount
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startLesson: () => dispatch(LessonActions.startLesson()),
    changeVol: volume => dispatch(PlaybackActions.playbackVolChange(volume)),
    changeSpeed: speed => dispatch(PlaybackActions.playbackSpeedChange(speed)),
    startNight: () => dispatch(PlaybackActions.startNight()),
    playerStart: () => dispatch(PlaybackActions.playerStart()),
    playerStop: () => dispatch(PlaybackActions.playerStop())
  };
};

const enhance = withObservables(
  ["currentCardId"],
  ({ database, currentCardId, navigation }) => {
    const lesson = navigation.getParam("lesson");
    return {
      card: currentCardId
        ? database.collections.get("cards").findAndObserve(currentCardId)
        : of$(null)
      // cardsCount: lesson.cards.observeCount()
    };
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDatabase(enhance(PlayerScreen)));
