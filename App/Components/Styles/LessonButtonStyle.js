// @flow

import { Metrics, Colors, Fonts } from '../../Themes/'

export default {
  button: {
    height: 45,
    borderRadius: 5,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.cheeryPink,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  buttonText: {
    color: Colors.snow,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: Fonts.size.medium,
    marginVertical: Metrics.baseMargin,
    flex: 1
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderColor: Colors.snow,
    // height: 44,
    width: 50,
    height: '100%'
  },
  nbLeft: {
    fontSize: 23,
    color: Colors.snow
  }
}
