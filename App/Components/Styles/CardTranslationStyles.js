// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles } from "../../Themes";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
    marginBottom: 5
  },
  note: {
    padding: 5
  },
  translationContainer: {
    minHeight: "40%",
    flex: -1,
    justifyContent: "center"
  },
  copilotBox: {
    position: "absolute",
    height: 80,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    marginTop: -100
  }
});
