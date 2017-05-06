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
import PlaybackActions from '../Redux/PlaybackRedux'
import TranslationText from '../Components/TranslationText'
import Explanation from '../Components/Explanation'
import { Colors } from '../Themes'
import images from '../Lessons/images/images'

// Styles
import styles from './Styles/AnkiScreenStyle'

class CardTranslation extends React.Component {
  state = {
    modalVisible: false
  }

  componentWillMount () {
    this.props.showAnswer()
  }

  speakText (sentence) {
    // Player.speakWordInLanguage(text, 'th-TH', 0.7)
    this.props.play(sentence, 'th-TH', 1, 0.7)
  }

  renderFullTranslation () {
    if (this.props.currentCard.fullSentence) {
      return (
        <TranslationText translation={this.props.currentCard.fullSentence.translation}
          transliteration={this.props.currentCard.fullSentence.transliteration}
          onPress={() => this.speakText(this.props.currentCard.fullSentence.translation)} />
      )
    }
  }

  renderImage () {
    return (
      <Image style={styles.image} resizeMode='contain' source={images[this.props.currentCard.id]} />
    )
  }

  renderNote () {
    if (this.props.currentCard.note) {
      return (
        <Text style={styles.note}>{this.props.currentCard.note}</Text>
      )
    }
  }

  renderExplanation () {
    if (this.props.currentCard.explanation) {
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
                <Explanation explanation={this.props.currentCard.explanation} />
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
          <TranslationText translation={this.props.currentCard.sentence.translation}
            transliteration={this.props.currentCard.sentence.transliteration}
            onPress={() => this.speakText(this.props.currentCard.sentence.translation)} />
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
    currentCard: state.lesson.currentCard,
    lesson: state.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    play: (sentence, language, volume, speed) => dispatch(
      PlaybackActions.playbackStart(sentence, language, volume, speed))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardTranslation)
