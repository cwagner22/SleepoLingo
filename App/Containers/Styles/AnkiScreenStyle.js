// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  wrapper: {
    backgroundColor: 'transparent'
  },
  noMoreCardsContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  noMoreCards: {
    textAlign: 'center',
    paddingBottom: 25,
    fontSize: 20
  },
  finishButton: {
    marginTop: 'auto'
  }
})
