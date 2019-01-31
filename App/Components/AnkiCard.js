// @flow

import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Card as CardElem } from "react-native-elements";
import FlipCard from "react-native-flip-card";

import CardOriginal from "./CardOriginal";
import CardTranslation from "../Containers/CardTranslation";

// Styles
import styles from "./Styles/AnkiCardStyle";

export default class AnkiCard extends React.Component {
  static propTypes = {
    cardId: PropTypes.number
  };

  componentWillMount() {
    this.setState({ card: Card.getFromId(this.props.cardId, true) });
  }

  state = {
    flip: false
  };

  flip() {
    this.setState({ flip: !this.state.flip });
  }

  render() {
    if (!this.state.card) {
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
              text={this.state.card.sentence.original}
              fullText={
                this.state.card.fullSentence &&
                this.state.card.fullSentence.original
              }
              onPress={() => this.flip()}
            />
          </CardElem>
          <CardElem
            containerStyle={{ flex: 1, padding: 5 }}
            wrapperStyle={{ flex: 1 }}
          >
            <CardTranslation
              cardId={this.state.card.id}
              sentence={this.state.card.sentence}
              fullSentence={this.state.card.fullSentence}
              note={this.state.card.note}
              onPress={() => this.flip()}
            />
          </CardElem>
        </FlipCard>
      </View>
    );
  }
}
