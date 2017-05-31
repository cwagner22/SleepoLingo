// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
    marginBottom: 5
  },
  note: {
    padding: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  explanationButton: {
    marginTop: -25
  },
  translationContainer: {
    minHeight: '50%',
    flex: -1,
    justifyContent: 'center'
  },
  innerExplanationContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20
  }
})
