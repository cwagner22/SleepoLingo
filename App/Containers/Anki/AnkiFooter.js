// @flow

import React, { PureComponent } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { CopilotStep } from "@okgrow/react-native-copilot";

import LessonActions from "../../Redux/LessonRedux";
import AnkiButton from "../../Components/Anki/AnkiButton";

// Styles
import styles from "./AnkiFooterStyle";

class WalkthroughableFakeBox extends PureComponent {
  render() {
    return <View {...this.props.copilot} style={styles.copilotBox} />;
  }
}

class AnkiFooter extends React.Component {
  renderCopilot() {
    // Render CopilotStep once showAnswer is true. Rendering before that will make it step 1.
    return (
      <CopilotStep
        text="Select how difficult it is to memorize it. Easy cards won't come back for 2 days so you have time to focus on the harder ones."
        order={3}
        name="ankiFooter"
      >
        <WalkthroughableFakeBox />
      </CopilotStep>
    );
  }
  render() {
    const { showAnswer } = this.props;
    let answerStyles = {};
    if (!showAnswer) {
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
          testID="AnkiButtonHard"
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
        {showAnswer && this.renderCopilot()}
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
