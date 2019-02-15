// @flow

import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import ProgressBar from "react-native-progress/Bar";

import Time from "../../Services/Time";

// Styles
import styles from "../Styles/PlayerProgressStyle";
import { Colors, Metrics } from "../../Themes";

class PlayerProgress extends React.Component {
  durationStr(ms) {
    var hours = Math.floor(ms / 1000 / 3600);
    var mins = Math.round(ms / 1000 / 60 - hours * 60);
    var str = "";
    if (hours) {
      str += hours + "h ";
    }

    str += mins + "mins";
    return str;
  }

  render() {
    const {
      cardsCount,
      card,
      lessonLoopCounter,
      elapsedTime,
      duration,
      lessonLoopMax
    } = this.props;
    const nbLeft = cardsCount - card.index;

    const nbPlayedPreviousLoop = lessonLoopCounter * cardsCount;
    const nbPlayed = nbPlayedPreviousLoop + card.index;
    const progress = nbPlayed / (cardsCount * lessonLoopMax);

    return (
      <View>
        <View style={styles.infoContainer}>
          <Text style={styles.timeElapsed}>
            {Time.formattedTime(elapsedTime)}
          </Text>
          <View style={styles.textContainer}>
            <Text
              style={styles.text}
            >{`${nbLeft} cards remaining (${lessonLoopCounter +
              1}/${lessonLoopMax})`}</Text>
          </View>
          <Text style={styles.timeLeft}>
            {Time.formattedTime(duration - elapsedTime)}
          </Text>
        </View>
        <ProgressBar
          height={1}
          progress={progress}
          width={Metrics.screenWidth}
          style={styles.progressBar}
          color={Colors.darkGrey}
          borderColor="transparent"
          unfilledColor="rgba(255,255,255, 0.1)"
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    // cardsCount: state.playback.cardsCount,
    lessonLoopCounter: state.playback.lessonLoopCounter,
    duration: state.playback.duration,
    elapsedTime: state.playback.elapsedTime,
    lessonLoopMax: state.playback.lessonLoopMax
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerProgress);
