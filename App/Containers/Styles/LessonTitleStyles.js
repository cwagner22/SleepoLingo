import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  // Copied from react-navigation/src/views/HeaderTitle.js
  title: {
    fontSize: Platform.OS === 'ios' ? 17 : 18,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16
  }
})
