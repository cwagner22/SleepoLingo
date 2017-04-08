// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ankiFooter: {
    flexDirection: 'row'
  },
  ankiHard: {
    flex: 1,
    backgroundColor: Colors.fernFrond
  },
  ankiOk: {
    flex: 1,
    backgroundColor: Colors.wattle
  },
  ankiEasy: {
    flex: 1,
    backgroundColor: Colors.capePalliser
  }
})
