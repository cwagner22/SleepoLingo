// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  button: {
    marginHorizontal: 0
  },
  nightIconContainer: {
    position: "absolute",
    bottom: 80,
    right: 30
  }
});
