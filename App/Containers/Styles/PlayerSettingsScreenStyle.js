// @flow

import { StyleSheet, Platform } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainer: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: Metrics.baseMargin
      },
      android: {
        backgroundColor: 'white'
      }
    })
  },
  header: {
    ...Platform.select({
      ios: {
        color: Colors.darkGrey,
        marginTop: 15
      },
      android: {
        color: '#009688',
        fontWeight: 'bold'
      }
    })
  },
  title: {
    ...Platform.select({
      ios: {},
      android: {
        color: 'black',
        fontSize: 16
      }
    })
  }
})
