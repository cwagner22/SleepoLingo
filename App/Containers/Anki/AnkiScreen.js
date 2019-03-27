// @flow

import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import Swiper from "react-native-swiper-animated";
import { Card } from "react-native-elements";

import AnkiFooter from "./AnkiFooter";
import AnkiCard from "../../Components/Anki/AnkiCard";
import RoundedButton from "../../Components/RoundedButton";

import withObservables from "@nozbe/with-observables";
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";

// Styles
import styles from "./AnkiScreenStyle";

class AnkiScreen extends React.Component {
  componentDidUpdate(prevProps) {
    const { currentCardId } = this.props;

    if (prevProps.currentCardId !== currentCardId && currentCardId) {
      // Next card
      this.swiper.jumpToIndex(this.currentCardIndex(), true);
    }
  }

  currentCardIndex() {
    return this.props.cards.find(c => c.id === this.props.currentCardId).index;
  }

  renderNoCards() {
    return (
      <Card
        wrapperStyle={{ flex: 1 }}
        containerStyle={{ flex: 1 }}
        title="LESSON DONE"
      >
        <View style={styles.noMoreCardsContainer}>
          <Text style={styles.noMoreCards}>
            Well done there are no more cards, come back later!
          </Text>
        </View>
        <RoundedButton
          styles={styles.finishButton}
          onPress={() => this.props.navigation.navigate("LessonsList")}
        >
          Finish
        </RoundedButton>
      </Card>
    );
  }

  swiper = null;

  render() {
    const { cards, currentCardId } = this.props;

    if (!currentCardId) {
      return this.renderNoCards();
    }
    return (
      <View style={{ flex: 1 }} testID="AnkiSwipe">
        <Swiper
          ref={swiper => {
            this.swiper = swiper;
          }}
          style={styles.wrapper}
          showPagination={false}
          swiper={false}
          index={this.currentCardIndex()}
          backPressToBack={false}
        >
          {cards.map(card => (
            <AnkiCard card={card} key={card.id} />
          ))}
        </Swiper>
        <AnkiFooter />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentCardId: state.lesson.currentCardId
  };
};

const enhance = withObservables(
  ["currentCardId"],
  ({ database, navigation, currentCardId }) => {
    // todo: load from db instead?
    // Although that could make it harder to retrieve lesson name from navigation options
    const lesson = navigation.getParam("lesson");

    return {
      // card: database.collections.get("cards").findAndObserve(currentCardId),
      lesson,
      cards: lesson.cards
    };
  }
);

export default connect(
  mapStateToProps,
  null
)(enhance(AnkiScreen));
