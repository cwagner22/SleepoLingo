// @flow

import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Button, Icon } from "react-native-elements";

import styles from "./Styles/LessonButtonStyle";
import { Colors } from "../Themes/";

export default class LessonButton extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    nbLeft: PropTypes.number,
    isCompleted: PropTypes.bool,
    styles: PropTypes.func,
    testID: PropTypes.string
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
    let content;
    if (this.props.isCompleted) {
      content = <Icon name="done" color="white" />;
    } else {
      content = <Text style={styles.nbLeft}>{this.props.nbLeft}</Text>;
    }

    return <View style={styles.rightContainer}>{content}</View>;
  }

  render() {
    return (
      <Button
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        onPress={this.props.onPress}
        title={this.props.text}
        icon={this.renderNbLeft()}
        iconRight={true}
        testID={this.props.testID}
      />
    );
  }
}
