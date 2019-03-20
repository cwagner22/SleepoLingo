import { StyleSheet } from "react-native";
import { Colors, Metrics } from "../../Themes/";

export default StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontFamily: "Alterlight-Regular",
    fontSize: 29,
    color: Colors.cheeryPink,
    // Fix truncated font title
    padding: 5,
    marginTop: -5
  }
});
