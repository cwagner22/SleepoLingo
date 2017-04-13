// @flow

import React from 'react'
import { TouchableHighlight, View, Text } from 'react-native'

import styles from './Styles/TranslationTextStyle'

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
        underlayColor='#F3F3F3'>
        <View>
          <Text style={styles.title}>{this.props.translation}</Text>
          <Text
            style={styles.title}>{this.props.transliteration && this.props.transliteration}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

export default TranslationText