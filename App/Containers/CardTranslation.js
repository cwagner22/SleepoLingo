// @flow

import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  Modal,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'

import LessonActions from '../Redux/LessonRedux'
import Player from '../Services/Player'
import TranslationText from '../Components/TranslationText'
import Explanation from '../Components/Explanation'
import { Colors } from '../Themes'

// Styles
import styles from './Styles/AnkiScreenStyle'

class CardTranslation extends React.Component {
  state = {
    modalVisible: false
  }

  componentWillMount () {
    this.props.showAnswer()
  }

  speakText (text) {
    Player.speakWordInLanguage(text, 'th-TH', 0.7)
  }

  renderFullTranslation () {
    if (this.props.currentWord.full) {
      return (
        <TranslationText translation={this.props.currentWord.full.translation}
          transliteration={this.props.currentWord.full.transliteration}
          onPress={() => this.speakText(this.props.currentWord.full.translation)} />
      )
    }
  }

  renderImage () {
    if (this.props.currentWord.image) {
      return (
        <Image style={styles.image} resizeMode='contain' source={this.props.currentWord.image} />
      )
    }
  }

  renderNote () {
    if (this.props.currentWord.note) {
      return (
        <Text style={styles.note}>{this.props.currentWord.note}</Text>
      )
    }
  }

  renderExplanation () {
    if (this.props.currentWord.explanation) {
      return (
        <View>
          <Modal
            animationType={'none'}
            transparent
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setModalVisible(false) }}
          >
            <TouchableOpacity style={styles.modalContainer} activeOpacity={0.7}
              onPressOut={() => { this.setModalVisible(false) }}>
              <View style={styles.innerContainer}>
                <Explanation explanation={this.props.currentWord.explanation} />
              </View>
            </TouchableOpacity>
          </Modal>
          <View>
            <TouchableHighlight onPress={() => { this.setModalVisible(true) }} style={styles.explanation}
              underlayColor={Colors.underlayGrey}>
              <Text>Explanation</Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
  }

  setModalVisible (visible) {
    this.setState({modalVisible: visible})
  }

  render () {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={() => this.props.onPress()}>
        <View style={[styles.container, {padding: 5}]}>
          <TranslationText translation={this.props.currentWord.translation}
            transliteration={this.props.currentWord.transliteration}
            onPress={() => this.speakText(this.props.currentWord.translation)} />
          {this.renderFullTranslation()}
          {this.renderExplanation()}
          {this.renderImage()}
          {this.renderNote()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentWord: state.lesson.words[state.lesson.currentWordId],
    lesson: state.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardTranslation)
