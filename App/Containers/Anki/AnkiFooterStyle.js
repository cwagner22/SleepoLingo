// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles, Colors } from "../../Themes";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ankiFooter: {
    flexDirection: "row"
  },
  ankiHard: {
    flex: 1,
    backgroundColor: Colors.easternBlue
  },
  ankiOk: {
    flex: 1,
    backgroundColor: Colors.pastelGreen
  },
  ankiEasy: {
    flex: 1,
    backgroundColor: Colors.cheeryPink
  },
  copilotBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    zIndex: -1
  }
});
