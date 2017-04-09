// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    marginBottom: 10
  },
  title: {
    fontSize: 29,
    textAlign: 'center'
  }
})
