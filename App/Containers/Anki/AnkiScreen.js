// @flow

import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import Swiper from "react-native-swiper-animated";
import { Card } from "react-native-elements";
import { copilot } from "@okgrow/react-native-copilot";
import withObservables from "@nozbe/with-observables";

import AnkiFooter from "./AnkiFooter";
import AnkiCard from "../../Components/Anki/AnkiCard";
import RoundedButton from "../../Components/RoundedButton";
import AppActions from "../../Redux/AppRedux";
import CopilotService from "../../Services/Copilot";

// Styles
import styles from "./AnkiScreenStyle";

class AnkiScreen extends React.Component {
  constructor(props) {
    super(props);
    // Create the copilot here to have access to ankiFooter
    // Started in CardTranslation
    this.copilot = new CopilotService("cardTranslation", this.props);
  }

  componentWillUnmount() {
    this.copilot.unload();
  }

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
            <AnkiCard card={card} key={card.id} copilot={this.copilot} />
          ))}
        </Swiper>
        <AnkiFooter />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentCardId: state.lesson.currentCardId,
    copilotScreens: state.app.copilotScreens,
    showAnswer: state.lesson.showAnswer
  };
};

const mapDispatchToProps = dispatch => ({
  addCopilotScreen: screen => dispatch(AppActions.addCopilotScreen(screen))
});

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
  mapDispatchToProps
)(enhance(copilot()(AnkiScreen)));
