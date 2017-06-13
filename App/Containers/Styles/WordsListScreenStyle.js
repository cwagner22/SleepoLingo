import { StyleSheet } from 'react-native'
import { colors, normalize } from 'react-native-elements'
import { ApplicationStyles, Metrics, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  header: {
    backgroundColor: Colors.fire,
    marginVertical: Metrics.smallMargin,
    padding: 10
  },
  headerText: {
    fontWeight: 'bold',
    color: Colors.snow,
    marginVertical: Metrics.smallMargin
  },
  // collapsible: {
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   backgroundColor: Colors.snow,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   flexWrap: 'wrap'
  // },
  collapsibleText: {
    color: colors.grey3,
    fontSize: normalize(12),
    marginTop: 1,
    fontWeight: 'bold'
  //   ...Platform.select({
  //     ios: {
  //       fontWeight: '600',
  //     },
  //     android: {
  //       ...fonts.android.bold,
  //     },
  //   }),
  },
  collapsibleContainer: {
    marginLeft: 10,
    alignSelf: 'flex-start'
  },
  title: {
    fontSize: normalize(14),
    color: colors.grey1,
    marginLeft: 10
  }
})
