// @flow

import React, { PropTypes } from 'react'
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
import ActionButton from 'react-native-action-button'

import LessonActions from '../Redux/LessonRedux'
import PlaybackActions from '../Redux/PlaybackRedux'
import TranslationText from '../Components/TranslationText'
import Explanation from '../Components/Explanation'
import { Colors } from '../Themes'
import images from '../Lessons/images/images'
import { Word } from '../Realm/realm'

// Styles
import styles from './Styles/CardTranslationStyles'

class CardTranslation extends React.Component {
  static propTypes = {
    cardId: PropTypes.number,
    sentence: PropTypes.object,
    fullSentence: PropTypes.object,
    note: PropTypes.string,
    onPress: PropTypes.func
  }

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
        <View style={styles.explanationButton}>
          <ActionButton buttonColor={Colors.easternBlue} onPress={() => this.setModalVisible(true)} offsetX={5} offsetY={0}
            size={51} icon={<Icon name='g-translate' color='white' />} />
        </View>
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
          {this.renderExplanation()}
          <View style={{flex: 1, zIndex: -1}}>
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
