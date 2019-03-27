import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  text: {
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin
  }
});
