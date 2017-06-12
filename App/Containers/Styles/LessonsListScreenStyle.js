// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes/'

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
    justifyContent: 'center'
  },
  bigHeader: {
    fontWeight: 'bold',
    fontFamily: 'Alterlight-Regular',
    fontSize: 32,
    color: Colors.cheeryPink,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5 // to show hidden part of the title
  },
  header: {
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: Metrics.smallMargin
  },
  pickLesson: {
    fontWeight: 'bold',
    paddingVertical: Metrics.baseMargin,
    paddingHorizontal: Metrics.section
  },
  boldLabel: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
    marginVertical: Metrics.smallMargin
  },
  listContent: {
    // marginTop: Metrics.baseMargin
  }
})
