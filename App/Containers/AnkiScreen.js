// @flow

import React from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";
import Swiper from "react-native-swiper-animated";
import { Card } from "react-native-elements";

import LessonActions from "../Redux/LessonRedux";
import AnkiFooter from "./AnkiFooter";
import AnkiCard from "../Components/AnkiCard";
import RoundedButton from "../Components/RoundedButton";
import NavigationActions from "../Navigation/NavigationActions";
import LessonTitle from "./LessonTitle";

import withObservables from "@nozbe/with-observables";
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";

// Styles
import styles from "./Styles/AnkiScreenStyle";

class AnkiScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerTitle: <LessonTitle />,
      headerRight: (
        <Button onPress={() => params.navigateToWords()} title="All Words" />
      )
    };
  };

  componentDidUpdate(prevProps) {
    const { card } = this.props;

    if (prevProps.card.id !== card.id) {
      // Next card
      this.swiper.jumpToIndex(card.index, true);
    }
  }

  // componentDidMount() {
  //   this.props.navigation.setParams({
  //     navigateToWords: this.props.navigateToWords
  //   });
  // }

  currentCardIndex() {
    return this.props.card.index;
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
          onPress={this.props.navigateToLessons}
        >
          Finish
        </RoundedButton>
      </Card>
    );
  }

  swiper = null;

  render() {
    if (!this.props.currentCardId) {
      return this.renderNoCards();
    }
    return (
      <View style={{ flex: 1 }}>
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
          {this.props.cards.map(card => (
            <AnkiCard card={card} key={card.id} sentence={card.sentence} />
          ))}
        </Swiper>
        <AnkiFooter />
      </View>
    );
  }
}

const mapStateToProps = state => {
  // const lesson = Lesson.getFromId(state.lesson.currentLessonId, true);
  return {
    // lesson: state.lesson,
    // cards: state.lesson.cards,
    currentCardId: state.lesson.currentCardId
    // cardIds: lesson.cards.map(c => c.id)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    navigateToLessons: () =>
      dispatch(NavigationActions.reset("LessonsListScreen")),
    navigateToWords: () =>
      dispatch(NavigationActions.navigate("WordsListScreen"))
  };
};

const enhance = withObservables(
  ["currentCardId"],
  ({ database, navigation, currentCardId }) => {
    const lesson = navigation.getParam("lesson"); // todo: load from db instead?

    return {
      card: database.collections.get("cards").findAndObserve(currentCardId),
      lesson: lesson.observe(),
      cards: lesson.cards.observe()
    };
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDatabase(enhance(AnkiScreen)));
