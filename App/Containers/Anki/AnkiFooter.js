// @flow

import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import LessonActions from "../../Redux/LessonRedux";
import AnkiButton from "../../Components/Anki/AnkiButton";

// Styles
import styles from "./AnkiFooterStyle";

class AnkiFooter extends React.Component {
  render() {
    let answerStyles = {};
    if (!this.props.showAnswer) {
      answerStyles.opacity = 0;
    }

    return (
      <View
        style={[styles.ankiFooter, answerStyles]}
        pointerEvents={this.props.showAnswer ? "auto" : "none"}
      >
        <AnkiButton
          styles={styles.ankiHard}
          text="Hard"
          subText="(1 min)"
          onPress={() => this.props.ankiDifficulty("hard")}
        />
        <AnkiButton
          styles={styles.ankiOk}
          text="OK"
          subText="(10 mins)"
          onPress={() => this.props.ankiDifficulty("ok")}
        />
        <AnkiButton
          styles={styles.ankiEasy}
          text="Easy"
          subText="(2 days)"
          onPress={() => this.props.ankiDifficulty("easy")}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWord: state.lesson.currentWord,
    showAnswer: state.lesson.showAnswer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ankiDifficulty: difficulty =>
      dispatch(LessonActions.ankiDifficulty(difficulty))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnkiFooter);
