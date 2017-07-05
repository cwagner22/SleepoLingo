// @flow

import { Platform } from 'react-native'
import variables from 'native-base/src/theme/variables/platform'

import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default {
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
  list: {
    ...Platform.select({
      ios: {
        backgroundColor: 'white'
      }
    })
  },
  header: {
    ...Platform.select({
      ios: {
        backgroundColor: '#E9E9EF'
      },
      android: {
        backgroundColor: Colors.snow
      }
    })
  },
  headerText: {
    ...Platform.select({
      android: {
        color: '#009688',
        fontWeight: 'bold',
        fontSize: 14
      }
    })
  },
  bodyMulti: {
    marginLeft: -variables.listItemPadding
  }
}
