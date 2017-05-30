// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  button: {
    backgroundColor: Colors.cheeryPink
  },
  nightButton: {
    position: 'absolute',
    bottom: 85,
    right: 30
  }
})
