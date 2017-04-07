// @flow

import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  button: {
    marginTop: 5,
    // borderColor: Colors.cedar,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    backgroundColor: Colors.fernFrond
  },
  buttonText: {
    margin: 18,
    textAlign: 'center',
    color: Colors.snow,
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.bold
  }
})
