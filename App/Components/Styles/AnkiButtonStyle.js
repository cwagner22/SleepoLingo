// @flow

import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  button: {
    marginTop: 5,
    padding: 15
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.snow,
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.bold
  }
})
