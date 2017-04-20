// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  title: {
    fontSize: 29,
    textAlign: 'center'
  },
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
  innerContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20
    // alignItems: 'center', // Weird display issue
  },
  explanation: {
    alignSelf: 'flex-end'
  }
})
