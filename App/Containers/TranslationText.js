// @flow

import React from "react";
import PropTypes from "prop-types";
import {
  TouchableHighlight,
  View,
  Text,
  Modal,
  TouchableOpacity
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import withObservables from "@nozbe/with-observables";
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import { Q } from "@nozbe/watermelondb";

import { Colors } from "../Themes/index";
import PlaybackActions from "../Redux/PlaybackRedux";
import Explanation from "../Components/Explanation";
import Dictionary from "../Models/Dictionary";

import styles from "./Styles/TranslationTextStyle";

class TranslationText extends React.Component {
  static propTypes = {
    translation: PropTypes.string,
    transliteration: PropTypes.string,
    showExplanation: PropTypes.bool
  };

  state = {
    modalVisible: false
  };

  speakText(sentence) {
    this.props.play(sentence, "th-TH", 1, 0.7);
  }

  renderExplanation() {
    if (!this.props.showExplanation) return null;

    let explanation = [];
    const sentenceWordsStr = this.props.translation.split(" ");

    for (const wordStr of sentenceWordsStr) {
      // todo: look for custom explanation?
      const wordDict = this.props.words.find(w => w.original === wordStr);

      if (wordDict) {
        explanation.push(wordDict);
      } else {
        console.log(`${wordStr} not found`);
      }
    }

    return (
      <View>
        <Modal
          animationType={"none"}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={0.7}
            onPressOut={() => {
              this.setModalVisible(false);
            }}
          >
            <View style={styles.innerExplanationContainer}>
              <Explanation explanation={explanation} />
            </View>
          </TouchableOpacity>
        </Modal>
        <View style={styles.explanationButton}>
          <Icon
            name="g-translate"
            reverse
            color={Colors.easternBlue}
            size={23}
            iconStyle={styles.explanationIcon}
            onPress={() => this.setModalVisible(true)}
          />
        </View>
      </View>
    );
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View>
        <TouchableHighlight
          onPress={() => this.speakText(this.props.translation)}
          style={styles.container}
          underlayColor={Colors.underlayGrey}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{this.props.translation}</Text>
            <Text style={styles.title}>
              {this.props.transliteration && this.props.transliteration}
            </Text>
          </View>
        </TouchableHighlight>
        {this.renderExplanation()}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    play: (sentence, language, volume, speed) =>
      dispatch(PlaybackActions.playbackStart(sentence, language, volume, speed))
  };
};

const enhance = withObservables(
  [],
  ({ database, translation, showExplanation }) => {
    if (!showExplanation) {
      return;
    }

    return {
      words: database.collections
        .get("dictionary")
        .query(Q.where("original", Q.oneOf(translation.split(" "))))
        .observe()
    };
  }
);

export default connect(
  null,
  mapDispatchToProps
)(withDatabase(enhance(TranslationText)));
