// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  textContainer: {
    padding: 7
  },
  text: {
    color: 'white',
    textAlign: 'center'
  },
  progressBar: {
  },
  timeElapsed: {
    color: Colors.darkGrey,
    fontSize: 10,
    padding: 5,
    width: 60
  },
  timeLeft: {
    color: Colors.darkGrey,
    textAlign: 'right',
    fontSize: 10,
    padding: 5,
    width: 60
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  }
})
