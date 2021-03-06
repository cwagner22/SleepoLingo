// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics } from "../../Themes/index";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    marginBottom: Metrics.baseMargin,
    // alignSelf: "center", // “Auto” width for text node, prevent from expanding full width
    paddingHorizontal: 5
  },
  innerContainer: {
    // alignSelf: "center"
  },
  title: {
    fontSize: 29,
    textAlign: "center"
  },
  explanationButton: {
    alignItems: "flex-end",
    position: "absolute",
    bottom: -45,
    right: 0,
    zIndex: 99 // Probably don't need that
  },
  explanationIcon: {
    fontSize: 25
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  innerExplanationContainer: {
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 20
  }
});
