// @flow

import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'

import TranslationText from '../Components/TranslationText'

import styles from './Styles/AnkiScreenStyle'

type CardOriginalProps = {
  text: string,
  fullText?: string,
  onPress: () => void,
}

class CardOriginal extends React.Component {
  props: CardOriginalProps

  renderFullOriginal () {
    if (this.props.fullText) {
      return (
        <TranslationText translation={this.props.fullText} />
      )
    }
  }

  render () {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={() => this.props.onPress()}>
        <View style={styles.container}>
          <TranslationText translation={this.props.text} />
          { this.renderFullOriginal() }
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default CardOriginal
