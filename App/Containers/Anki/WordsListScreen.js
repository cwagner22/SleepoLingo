import React from "react";
import { View, Text, TouchableHighlight, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Collapsible from "react-native-collapsible";
import withObservables from "@nozbe/with-observables";

import PlaybackActions from "../../Redux/PlaybackRedux";

import styles from "./WordsListScreenStyle";
import { Colors } from "../../Themes/index";

class WordsListScreen extends React.Component {
  state = {
    activeSection: null
  };

  play(text) {
    this.props.play(text, "th-TH", 1, 0.7);
  }

  _toggleSection(section) {
    const activeSection =
      this.state.activeSection === section ? false : section;
    this.setState({ activeSection });
  }

  renderItem(card) {
    const sentence = card.getSentence();
    const isCollapsed = this.state.activeSection !== card.id;
    const rightIcon = {
      name: isCollapsed ? "expand-more" : "expand-less"
    };

    return (
      <ListItem
        title={
          <View>
            <Text style={styles.title}>{sentence.original}</Text>
            <Collapsible
              collapsed={isCollapsed}
              style={styles.collapsibleContainer}
            >
              <TouchableHighlight
                onPress={() => this.play(sentence.translation)}
                underlayColor={Colors.underlayGrey}
              >
                <View>
                  <Text style={styles.collapsibleText}>
                    {sentence.translation}
                  </Text>
                  <Text style={styles.collapsibleText}>
                    {sentence.transliteration}
                  </Text>
                </View>
              </TouchableHighlight>
            </Collapsible>
          </View>
        }
        onPress={() => this._toggleSection(card.id)}
        key={card.id}
        rightIcon={rightIcon}
      />
    );
  }

  render() {
    const { cards } = this.props;
    return <ScrollView>{cards.map(card => this.renderItem(card))}</ScrollView>;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    play: (sentence, language, volume, speed) =>
      dispatch(PlaybackActions.playbackStart(sentence, language, volume, speed))
  };
};

const enhance = withObservables([], ({ navigation }) => {
  const lesson = navigation.getParam("lesson");

  return {
    cards: lesson.cards
  };
});

export default connect(
  null,
  mapDispatchToProps
)(enhance(WordsListScreen));
