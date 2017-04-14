import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.background
  },
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.snow,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
})
