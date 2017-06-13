import React from 'react'
import { View, Text, TouchableHighlight, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import Collapsible from 'react-native-collapsible'
import _ from 'lodash'

import { Lesson } from '../Realm/realm'
import PlaybackActions from '../Redux/PlaybackRedux'

import styles from './Styles/WordsListScreenStyle'
import { Colors } from '../Themes/index'

class WordsListScreen extends React.Component {
  state = {
    activeSection: null
  }

  play (text) {
    this.props.play(text, 'th-TH', 1, 0.7)
  }

  _toggleSection (section) {
    const activeSection = this.state.activeSection === section ? false : section
    this.setState({activeSection})
  }

  renderItem (card) {
    const sentence = card.fullSentence ? card.fullSentence : card.sentence
    const isCollapsed = this.state.activeSection !== card.id
    const rightIcon = {
      name: isCollapsed ? 'expand-more' : 'expand-less'
    }

    return (
      <ListItem
        title={
          <View>
            <Text style={styles.title}>{sentence.original}</Text>
            <Collapsible collapsed={isCollapsed} style={styles.collapsibleContainer}>
              <TouchableHighlight onPress={() => this.play(sentence.translation)} underlayColor={Colors.underlayGrey}>
                <View>
                  <Text style={styles.collapsibleText}>{sentence.translation}</Text>
                  <Text style={styles.collapsibleText}>{sentence.transliteration}</Text>
                </View>
              </TouchableHighlight>
            </Collapsible>
          </View>
        }
        onPress={() => this._toggleSection(card.id)}
        key={card.id}
        rightIcon={rightIcon}
      />
    )
  }

  renderList () {
    const cards = _.toArray(this.props.currentLesson.cards)

    return cards.map((card) => {
      return this.renderItem(card)
    })
  }

  render () {
    return (
      <ScrollView>
        <List>
          {this.renderList()}
        </List>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentLesson: Lesson.getFromId(state.lesson.currentLessonId)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    play: (sentence, language, volume, speed) => dispatch(
      PlaybackActions.playbackStart(sentence, language, volume, speed))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordsListScreen)
