import React from 'react'
import { View, Text, TouchableHighlight, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import Accordion from 'react-native-collapsible/Accordion'
import _ from 'lodash'

import Player from '../Services/Player'

import styles from './Styles/WordsListScreenStyle'

class WordsListScreen extends React.Component {
  _renderHeader (section) {
    const sentence = section.fullSentence ? section.fullSentence : section.sentence
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{sentence.original}</Text>
      </View>
    )
  }

  play (text) {
    Player.speakWordInLanguage(text, 'th-TH', 0.7)
  }

  _renderContent (section) {
    const sentence = section.fullSentence ? section.fullSentence : section.sentence
    return (
      <TouchableHighlight onPress={() => this.play(sentence.translation)}>
        <View style={styles.content}>
          <Text>{sentence.translation}</Text>
          <Text>{sentence.transliteration}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render () {
    const cards = _.toArray(this.props.currentLesson.cards)
    return (
      <ScrollView style={styles.container}>
        <Accordion
          sections={cards}
          renderHeader={this._renderHeader.bind(this)}
          renderContent={this._renderContent.bind(this)}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentLesson: state.lesson.currentLesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(WordsListScreen)
