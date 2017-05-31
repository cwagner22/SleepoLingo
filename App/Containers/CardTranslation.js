// @flow

import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  Modal,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'

import LessonActions from '../Redux/LessonRedux'
import PlaybackActions from '../Redux/PlaybackRedux'
import TranslationText from '../Components/TranslationText'
import Explanation from '../Components/Explanation'
import { Colors } from '../Themes'
import images from '../Lessons/images/images'
import { Word } from '../Realm/realm'

// Styles
import styles from './Styles/CardTranslationStyles'

type CardTranslationProps = {
  cardId: number,
  sentence: Object,
  fullSentence?: Object,
  note?: string,
  onPress: () => void
}

class CardTranslation extends React.Component {
  props: CardTranslationProps

  state = {
    modalVisible: false
  }

  componentWillMount () {
    this.props.showAnswer()
  }

  speakText (sentence) {
    this.props.play(sentence, 'th-TH', 1, 0.7)
  }

  renderTranslation () {
    return (
      <View style={styles.translationContainer}>
        <TranslationText translation={this.props.sentence.translation}
          transliteration={this.props.sentence.transliteration}
          onPress={() => this.speakText(this.props.sentence.translation)} />
        {this.renderFullTranslation()}
        {this.renderExplanation()}
      </View>
    )
  }

  renderFullTranslation () {
    const {fullSentence} = this.props
    if (this.props.fullSentence) {
      return (
        <TranslationText translation={fullSentence.translation}
          transliteration={fullSentence.transliteration}
          onPress={() => this.speakText(fullSentence.translation)} />
      )
    }
  }

  renderImage () {
    return (
      <Image style={styles.image} resizeMode='contain' source={images[this.props.cardId]} />
    )
  }

  renderNote () {
    const {note} = this.props
    if (!note) {
      return (
        <Text style={styles.note}>{note}</Text>
      )
    }
  }

  renderExplanation () {
    let explanation = []
    const sentence = this.props.fullSentence || this.props.sentence
    const words = sentence.translation.split(' ')
    for (const wordStr of words) {
      // todo: look for custom explanation
      let word = Word.getWord(wordStr)
      explanation.push(word || wordStr)
    }

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
            <View style={styles.innerExplanationContainer}>
              <Explanation explanation={explanation} />
            </View>
          </TouchableOpacity>
        </Modal>
        <Icon reverse name='g-translate' color={Colors.easternBlue} raised onPress={() => this.setModalVisible(true)}
          containerStyle={styles.explanationButton} />
      </View>
    )
  }

  setModalVisible (visible) {
    this.setState({modalVisible: visible})
  }

  render () {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={() => this.props.onPress()}>
        <View style={{flex: 1}}>
          {this.renderTranslation()}
          <View style={{flex: 1}}>
            {this.renderImage()}
            {this.renderNote()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    play: (sentence, language, volume, speed) => dispatch(
      PlaybackActions.playbackStart(sentence, language, volume, speed))
  }
}

export default connect(null, mapDispatchToProps)(CardTranslation)
