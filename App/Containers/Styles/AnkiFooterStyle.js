// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ankiFooter: {
    flexDirection: 'row'
  },
  ankiHard: {
    backgroundColor: Colors.fernFrond
  },
  ankiOk: {
    backgroundColor: Colors.wattle
  },
  ankiEasy: {
    backgroundColor: Colors.capePalliser
  }
})
