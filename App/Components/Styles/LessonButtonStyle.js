// @flow
import { StyleSheet } from "react-native";
import { Metrics, Colors, Fonts } from "../../Themes/";

export default StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 5,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.cheeryPink
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: Fonts.size.medium
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderColor: Colors.snow,
    width: 50,
    height: "100%",
    position: "absolute",
    right: 0
  },
  nbLeft: {
    fontSize: 23,
    color: Colors.snow
  }
});
