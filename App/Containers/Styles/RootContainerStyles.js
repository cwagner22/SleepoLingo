import { StyleSheet } from "react-native";
import { Fonts, Metrics, Colors, ApplicationStyles } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  applicationView: {
    flex: 1
  },
  updatingContainer: {
    flex: 1,
    justifyContent: "center"
  },
  updating: {
    fontSize: Fonts.size.h4,
    textAlign: "center",
    // fontFamily: Fonts.type.base,
    margin: Metrics.baseMargin
  }
});
