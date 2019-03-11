// @flow

import React from "react";
import { TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import styles from "../Styles/AnkiButtonStyle";

export default class AnkiButton extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    subText: PropTypes.string,
    onPress: PropTypes.func,
    styles: PropTypes.func,
    testID: PropTypes.string
  };

  render() {
    return (
      <TouchableOpacity
        style={[styles.button, this.props.styles]}
        onPress={this.props.onPress}
        testID={this.props.testID}
      >
        <Text style={styles.buttonText}>
          {this.props.text && this.props.text.toUpperCase()}
        </Text>
        <Text style={styles.buttonText}>
          {this.props.subText && this.props.subText.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
}
