// @flow

import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../Styles/AnkiButtonStyle";

type AnkiButtonProps = {
  text: string,
  subText: string,
  onPress: () => void,
  styles?: Object
};

export default class AnkiButton extends React.Component {
  props: AnkiButtonProps;

  render() {
    return (
      <TouchableOpacity
        style={[styles.button, this.props.styles]}
        onPress={this.props.onPress}
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
