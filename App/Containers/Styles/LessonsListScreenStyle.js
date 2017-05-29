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
  header: {
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: Metrics.smallMargin
  },
  boldLabel: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
    marginVertical: Metrics.smallMargin
  },
  listContent: {
    marginTop: Metrics.baseMargin
  }
})
