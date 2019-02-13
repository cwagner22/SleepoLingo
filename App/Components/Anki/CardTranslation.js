// @flow

import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { connect } from "react-redux";

import LessonActions from "../../Redux/LessonRedux";
import PlaybackActions from "../../Redux/PlaybackRedux";
import TranslationText from "./TranslationText";
import images from "../../Lessons/images/images";

// Styles
import styles from "../Styles/CardTranslationStyles";

class CardTranslation extends React.Component {
  static propTypes = {
    cardId: PropTypes.string,
    translation: PropTypes.string,
    transliteration: PropTypes.string,
    fullTranslation: PropTypes.string,
    fullTransliteration: PropTypes.string,
    note: PropTypes.string,
    onPress: PropTypes.func
  };

  componentWillMount() {
    this.props.showAnswer();
  }

  renderTranslation() {
    const { transliteration, translation, fullTranslation } = this.props;

    return (
      <View style={styles.translationContainer}>
        <TranslationText
          translation={translation}
          transliteration={transliteration}
          showExplanation={!fullTranslation}
        />
        {this.renderFullTranslation()}
      </View>
    );
  }

  renderFullTranslation() {
    const { fullTranslation, fullTransliteration } = this.props;
    if (fullTranslation) {
      return (
        <TranslationText
          translation={fullTranslation}
          transliteration={fullTransliteration}
          showExplanation
        />
      );
    }
  }

  renderImage() {
    return (
      <Image
        style={styles.image}
        resizeMode="contain"
        source={images[this.props.cardId]}
      />
    );
  }

  renderNote() {
    const { note } = this.props;
    if (note) {
      return <Text style={styles.note}>{note}</Text>;
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.onPress()}
      >
        <View style={{ flex: 1 }}>
          {this.renderTranslation()}
          <View style={{ flex: 1, zIndex: -1 }}>
            {this.renderImage()}
            {this.renderNote()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    play: (sentence, language, volume, speed) =>
      dispatch(PlaybackActions.playbackStart(sentence, language, volume, speed))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CardTranslation);
