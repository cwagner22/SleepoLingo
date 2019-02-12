import { StyleSheet } from "react-native";
import { Colors, Metrics } from "../../Themes/";

export default StyleSheet.create({
  bigHeaderTitle: {
    fontWeight: "bold",
    fontFamily: "Alterlight-Regular",
    fontSize: 32,
    color: Colors.cheeryPink,
    // Fix truncated font title
    padding: 5,
    marginTop: -5
  },
  drawerButton: { 
    marginHorizontal: Metrics.baseMargin
  }
});
