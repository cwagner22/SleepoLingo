// @flow

import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Card as CardElem } from "react-native-elements";
import FlipCard from "react-native-flip-card";
import withObservables from "@nozbe/with-observables";

import CardOriginal from "./CardOriginal";
import CardTranslation from "./CardTranslation";

// Styles
import styles from "../Styles/AnkiCardStyle";

class RawAnkiCard extends React.Component {
  // static propTypes = {
  //   card: PropTypes.object,
  //   sentence: PropTypes.object
  // };
  constructor(props) {
    super(props);
    this.state = {
      flip: false
    };
  }

  flip() {
    this.setState(state => ({
      flip: !state.flip
    }));
  }

  render() {
    const { card } = this.props;

    if (!card) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        <FlipCard
          style={styles.card}
          flip={this.state.flip}
          friction={15}
          perspective={1500}
          clickable={false}
          flipHorizontal
          flipVertical={false}
        >
          <CardElem
            containerStyle={{ flex: 1, padding: 5 }}
            wrapperStyle={{ flex: 1 }}
          >
            <CardOriginal
              text={card.sentenceOriginal}
              fullText={card.fullSentenceOriginal}
              onPress={() => this.flip()}
            />
          </CardElem>
          <CardElem
            containerStyle={{ flex: 1, padding: 5 }}
            wrapperStyle={{ flex: 1 }}
          >
            <CardTranslation
              cardId={card.id}
              translation={card.sentenceTranslation}
              transliteration={card.sentenceTransliteration}
              fullTranslation={card.fullSentenceTranslation}
              fullTransliteration={card.fullSentenceTransliteration}
              note={card.note}
              onPress={() => this.flip()}
            />
          </CardElem>
        </FlipCard>
      </View>
    );
  }
}

const enhance = withObservables(["card"], ({ card }) => ({
  card: card.observe()
}));

export default enhance(RawAnkiCard);
