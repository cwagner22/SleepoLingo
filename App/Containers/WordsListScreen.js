import React from 'react'
import { View, Text, TouchableHighlight, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import Accordion from 'react-native-collapsible/Accordion'

import LessonHelper from '../Services/LessonHelper'
import Player from '../Services/Player'

import styles from './Styles/WordsListScreenStyle'

class WordsListScreen extends React.Component {
  _renderHeader (section) {
    const word = section.full ? section.full : section
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{word.original}</Text>
      </View>
    )
  }

  play (text) {
    Player.speakWordInLanguage(text, 'th-TH', 0.4)
  }

  _renderContent (section) {
    const word = section.full ? section.full : section
    return (
      <TouchableHighlight style={styles.content} onPress={() => this.play(word.translation)}>
        <View>
          <Text>{word.translation}</Text>
          <Text>{word.transliteration}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Accordion
          sections={this.props.currentWords}
          renderHeader={this._renderHeader.bind(this)}
          renderContent={this._renderContent.bind(this)}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  const lessonHelper = new LessonHelper(state.lesson)
  return {
    currentWords: lessonHelper.currentWords()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(WordsListScreen)
