// @flow

import React, { Component } from "react";
import { SectionList, View, Text } from "react-native";
import { connect } from "react-redux";
import RNFS from "react-native-fs";
import withObservables from "@nozbe/with-observables";
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";

import LessonActions from "../Redux/LessonRedux";
import LessonButton from "../Components/LessonButton";

// Styles
import styles from "./Styles/LessonsListScreenStyle";

const RawLessonItem = ({ lesson, cards, onPress, testID }) => {
  const nbCardsLeft = () => {
    // todo: only for current lesson?
    return cards.reduce((total, card) => {
      if (card.isReady(false)) {
        total++;
      }
      return total;
    }, 0);
  };

  return (
    <View>
      <LessonButton
        text={lesson.name}
        nbLeft={nbCardsLeft()}
        onPress={onPress}
        isCompleted={lesson.isCompleted}
        testID={testID}
      />
    </View>
  );
};

const LessonItem = withObservables([], ({ lesson }) => ({
  // lesson: lesson.observe(),
  cards: lesson.cards.observe()
}))(RawLessonItem);

class LessonsListScreen extends Component {
  state = {};

  renderHeader(data, sectionID) {
    return (
      <View>
        <Text style={styles.header}>{sectionID}</Text>
      </View>
    );
  }

  render() {
    const { loadLesson, lessons, lessonGroups } = this.props;

    // lessons by group name as title
    const sections = lessons.reduce((sections, lesson) => {
      const lessonGroupName = lessonGroups.find(
        g => g.id === lesson.lessonGroup.id
      ).name;
      let section = sections.find(s => s.title === lessonGroupName);
      if (!section) {
        section = {
          title: lessonGroupName,
          data: []
        };
        sections.push(section);
      }

      section.data.push(lesson);
      return sections;
    }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.pickLesson}>Pick a lesson</Text>
        <SectionList
          renderItem={({ item: lesson, index, section }) => (
            <LessonItem
              lesson={lesson}
              onPress={() => loadLesson(lesson)}
              testID={`LessonItem_${index}`}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
          sections={sections}
          keyExtractor={item => item.id}
        />
        <Text style={styles.footer}>
          Use the contact section to leave your suggestions. More languages will
          be added in the future. 😉
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    // lesson: Lesson.getFromId(state.lesson.currentLessonId, true),
    // playerRunning: state.playback.playerRunning
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadLesson: lesson => dispatch(LessonActions.loadLesson(lesson))
    // startAnki: () => dispatch(LessonActions.startAnki())
  };
};

const enhance = withObservables([], ({ database }) => ({
  lessons: database.collections
    .get("lessons")
    .query()
    .observe(),
  lessonGroups: database.collections
    .get("lesson_groups")
    .query()
    .observe()
}));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDatabase(enhance(LessonsListScreen)));
