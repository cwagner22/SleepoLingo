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
  }
});
