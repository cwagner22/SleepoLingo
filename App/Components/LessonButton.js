// @flow

import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Button, Icon } from "native-base";

import styles from "./Styles/LessonButtonStyle";
import { Colors } from "../Themes/";

export default class LessonButton extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    nbLeft: PropTypes.number,
    isCompleted: PropTypes.bool,
    styles: PropTypes.func
  };

  completedStyle() {
    if (this.props.isCompleted) {
      return {
        opacity: 0.5,
        backgroundColor: Colors.pastelGreen
      };
    }
  }

  renderNbLeft() {
    if (!this.props.isCompleted) {
      return <Text style={styles.nbLeft}>{this.props.nbLeft}</Text>;
    } else {
      return <Icon name="done" color="white" />;
    }
  }

  render() {
    return (
      <Button style={styles.button} onPress={this.props.onPress} block>
        <Text style={styles.buttonText}>{this.props.text}</Text>
        <View style={styles.rightContainer}>{this.renderNbLeft()}</View>
      </Button>
    );
  }
}
