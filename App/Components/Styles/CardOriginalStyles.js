// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  title: {
    fontSize: 29,
    textAlign: "center",
    marginBottom: Metrics.baseMargin,
    paddingHorizontal: 5
  },
  copilotBox: {
    position: "absolute",
    height: 200,
    left: 0,
    right: 0
  },
  translationContainer: {
    minHeight: "50%",
    flex: -1,
    justifyContent: "center"
  }
});
