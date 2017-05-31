// @flow

import React from 'react'
import { TouchableHighlight, View, Text } from 'react-native'

import styles from './Styles/TranslationTextStyle'
import { Colors } from '../Themes'

type TranslationTextProps = {
  translation: string,
  transliteration?: string,
  onPress?: () => void
}

class TranslationText extends React.Component {
  props: TranslationTextProps

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress} style={styles.container}
        underlayColor={Colors.underlayGrey}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{this.props.translation}</Text>
          <Text
            style={styles.title}>{this.props.transliteration && this.props.transliteration}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

export default TranslationText
