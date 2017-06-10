// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  btnsContainer: {
    // marginTop: 'auto',
    // height: 50,
    // backgroundColor: 'white'
  },
  btns: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 50,
    paddingVertical: 10
  },
  speedButton: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    flex: 1
  },
  buttonIcon: {
    color: 'white'
  }
})
