import React from "react";
import { Text, View, Linking } from "react-native";
import RoundedButton from "../Components/RoundedButton";

// Styles
import styles from "./Styles/ContactScreenStyle";

export default class ContactScreenScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          More lessons? Another language? Leave a message! 😉
        </Text>
        <RoundedButton
          onPress={() =>
            Linking.openURL("mailto:hi@chriswt.com?subject=SleepoLingo")
          }
        >
          Contact Support
        </RoundedButton>
      </View>
    );
  }
}
