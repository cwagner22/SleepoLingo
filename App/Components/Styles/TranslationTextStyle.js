// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    marginBottom: Metrics.baseMargin,
    alignSelf: 'center', // “Auto” width for text node, prevent from expanding full width
    paddingHorizontal: 5
  },
  innerContainer: {
    alignSelf: 'center'
  },
  title: {
    fontSize: 29,
    textAlign: 'center'
  }
})
