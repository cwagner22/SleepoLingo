import React from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";
import { Button } from "react-native-elements";

import styles from "./Styles/RoundedButtonStyles";
import ExamplesRegistry from "../Services/ExamplesRegistry";

// Note that this file (App/Components/RoundedButton) needs to be
// imported in your app somewhere, otherwise your component won't be
// compiled and added to the examples dev screen.

// Ignore in coverage report
/* istanbul ignore next */
ExamplesRegistry.addComponentExample("Rounded Button", () => (
  <RoundedButton
    text="real buttons have curves"
    onPress={() => window.alert("Rounded Button Pressed!")}
  />
));

export default class RoundedButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    children: PropTypes.string,
    navigator: PropTypes.object,
    styles: PropTypes.object,
    testID: PropTypes.string
  };

  getText() {
    const buttonText = this.props.text || this.props.children || "";
    return buttonText.toUpperCase();
  }

  render() {
    return (
      <Button
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        onPress={this.props.onPress}
        title={this.getText()}
        testID={this.props.testID}
      />
    );
  }
}
