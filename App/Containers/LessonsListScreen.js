// @flow

import React, { Component } from "react";
import { SectionList, View, Text } from "react-native";
import { connect } from "react-redux";
import RNFS from "react-native-fs";
// import { Sentry } from 'react-native-sentry'
import withObservables from "@nozbe/with-observables";
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";

import LessonActions from "../Redux/LessonRedux";
// import { addTodo } from "../redux/actions";
import LessonButton from "../Components/LessonButton";
import DrawerButton from "../Components/DrawerButton";

// Styles
import styles from "./Styles/LessonsListScreenStyle";

const RawLessonItem = ({ lesson, cards, onPress }) => {
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
      />
    </View>
  );
};

const LessonItem = withObservables([], ({ lesson }) => ({
  lesson: lesson.observe(),
  cards: lesson.cards.observe()
}))(RawLessonItem);

const RawSectionHeader = ({ lessonGroup }) => (
  <Text style={styles.header}>{lessonGroup.name}</Text>
);

const SectionHeader = withDatabase(
  withObservables([], ({ database, lessonGroupId }) => ({
    lessonGroup: database.collections
      .get("lesson_groups")
      .findAndObserve(lessonGroupId)
  }))(RawSectionHeader)
);

class LessonsListScreen extends Component {
  state = {};

  constructor(props) {
    super(props);

    var cachePath = RNFS.DocumentDirectoryPath + "/cache";

    // if (__DEV__) {
    //   // Empty cache
    //   RNFS.exists(cachePath).then((exists) => {
    //     var pomise = exists ? RNFS.unlink(cachePath) : Promise.resolve()
    //     pomise.then(this.createCache)
    //   })
    // } else {
    //   this.createCache()
    // }

    RNFS.exists(cachePath).then(exists => {
      if (!exists) {
        this.createCache();
      }
    });
  }

  createCache() {
    var cachePath = RNFS.DocumentDirectoryPath + "/cache";
    RNFS.mkdir(cachePath, { NSURLIsExcludedFromBackupKey: true });
  }

  goToLesson(lesson) {
    // Sentry.captureMessage('test2');
    // Sentry.captureException(new Error('Oops!'), {
    //   logger: 'my.module'
    // });
    // throw new Error('yest error')
    this.props.loadLesson(lesson.id);
    // this.props.navigateToLesson(lesson.id)
  }

  renderHeader(data, sectionID) {
    return (
      <View>
        <Text style={styles.header}>{sectionID}</Text>
      </View>
    );
  }

  render() {
    const { loadLesson, lessons } = this.props;

    // SOLUTION 1a
    // console.log(lessonGroups);
    // let sections = [];
    // for (var i = 0; i < lessonGroups.length - 1; i++) {
    //   const lessonGroup = lessonGroups[i];
    //   let section = {
    //     title: lessonGroup.name,
    //     data: []
    //     // data: lessonGroup.lessons (Query Object error)
    //   };
    //   sections.push(section);

    //   lessonGroup.lessons.query().then(a => {
    //     console.log(a);
    //     section.data = a;
    //     // SectionList not updating
    //     // Nested state is bad : https://stackoverflow.com/questions/43040721/how-to-update-nested-state-properties-in-react
    //   });
    // }

    // SOLUTION 2
    // Group lessons by group id as title
    const sections = lessons.reduce((sections, lesson) => {
      let section = sections.find(s => s.title === lesson.lessonGroup.id);
      if (!section) {
        section = {
          title: lesson.lessonGroup.id,
          data: []
        };
        sections.push(section);
      }

      section.data.push(lesson);
      return sections;
    }, []);

    console.log(sections);

    return (
      <View style={styles.container}>
        <Text style={styles.pickLesson}>Pick a lesson</Text>
        <SectionList
          renderItem={({ item: lesson, index, section }) => (
            <LessonItem lesson={lesson} onPress={() => loadLesson(lesson)} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader lessonGroupId={title} />
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

// SOLUTION 1b (JOIN, not working)
// export default withDatabase(
//   withObservables([], ({ database }) => ({
//     lessons: database.collections
//       .get("lessons")
//       .query()
//       .observe()
//   }))(LessonsListScreen)
// );

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
    .observe()
}));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDatabase(enhance(LessonsListScreen)));
