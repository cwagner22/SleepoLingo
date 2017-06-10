// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  progress: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    padding: 7
  },
  text: {
    color: 'white',
    textAlign: 'center'
  }
})
