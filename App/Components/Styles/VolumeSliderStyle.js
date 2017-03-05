import {StyleSheet} from 'react-native'
import { Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Metrics.smallMargin,
    backgroundColor: Colors.transparent,
    flexDirection: 'row',
    width: Metrics.screenWidth - Metrics.baseMargin
  },
  slider: {
    height: 10,
    margin: 10
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10
  }
})
