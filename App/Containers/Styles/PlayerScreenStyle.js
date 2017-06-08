// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainer: {
    flex: 1,
    backgroundColor: '#0e1a29'
  },
  sentenceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderBottomColor: 'white',
    borderBottomWidth: 1
  },
  sentence: {
    fontSize: 30,
    color: 'white'
  },
  stop: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stopIcon: {
    fontSize: 40,
    color: 'white'
  },
  stopText: {
    color: 'white'
  }
})
