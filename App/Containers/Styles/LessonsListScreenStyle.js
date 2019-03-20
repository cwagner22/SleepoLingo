// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
    // marginTop: Metrics.navBarHeight,
    // backgroundColor: Colors.mightyState
  },
  row: {
    flex: 1,
    backgroundColor: Colors.fire,
    marginVertical: Metrics.smallMargin,
    justifyContent: "center"
  },
  header: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    // textAlign: 'center',
    marginVertical: Metrics.smallMargin,
    marginHorizontal: Metrics.section,
    color: Colors.charcoal,
    backgroundColor: Colors.transparent
  },
  pickLesson: {
    fontWeight: "bold",
    paddingVertical: Metrics.baseMargin,
    paddingHorizontal: Metrics.section,
    textAlign: "center"
  },
  listContent: {
    // marginTop: Metrics.baseMargin
  },
  footer: {
    color: Colors.charcoal,
    textAlign: "center",
    padding: Metrics.baseMargin
  }
});
