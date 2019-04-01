// @flow

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, TouchableWithoutFeedback, Text } from "react-native";
import { copilot, CopilotStep } from "@okgrow/react-native-copilot";
import { connect } from "react-redux";

import styles from "../Styles/CardOriginalStyles";
import AppActions from "../../Redux/AppRedux";
import CopilotService from "../../Services/Copilot";

// Use a fake box for copilot since it's not possibe to have multiple walkthroughable custom components wrapped
const WalkthroughableFakeBox = ({ copilot }) => (
  <View {...copilot} style={styles.copilotBox} />
);

class CardOriginal extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    fullText: PropTypes.string,
    styles: PropTypes.func
  };

  componentDidMount() {
    this.copilot = new CopilotService("cardOriginal", this.props);
    this.copilot.start();
  }

  componentWillUnmount() {
    this.copilot.unload();
  }

  renderFullOriginal() {
    if (this.props.fullText) {
      return <Text style={styles.title}>{this.props.fullText}</Text>;
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.onPress()}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.translationContainer}>
            <CopilotStep
              text="Your first vocabulary flashcard! Learn the word at the top first before moving on to the example sentence."
              order={1}
              name="cardOriginal"
            >
              <WalkthroughableFakeBox />
            </CopilotStep>
            <Text style={styles.title}>{this.props.text}</Text>
            {this.renderFullOriginal()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  return {
    copilotScreens: state.app.copilotScreens
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addCopilotScreen: screen => dispatch(AppActions.addCopilotScreen(screen))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(copilot()(CardOriginal));
