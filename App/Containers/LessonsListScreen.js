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

const RawLessonItem = ({ lesson, cards }) => {
  const nbCardsLeft = () => {
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
        onPress={() => this.goToLesson(lesson)}
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

// const PostItem = withObservables(["lessons"], ({ lessons }) => ({
//   lessons: lessons.observe()
// }))(RawPostItem);
class LessonsListScreen extends Component {
  state = {};

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text style={styles.bigHeader}>SleepoLingo</Text>,
      headerLeft: <DrawerButton navigation={navigation} />,
      drawerLabel: "Lessons",
      // 'Lessons' may be better but is too long and causes overlapping. Since we are using a
      // custom component with headerTitle in the next screens the widths calculations are not made (only for string)
      // See: react-navigation/src/views/Header.js
      headerBackTitle: "Back",
      drawerLockMode: "unlocked"
    };
  };

  setupDataSource(props) {
    const rowHasChanged = (r1, r2) => r1 !== r2;
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2;

    const ds = new ListView.DataSource({
      rowHasChanged,
      sectionHeaderHasChanged
    });

    let data = {};
    const groups = LessonGroup.get();

    // for (const group of groups) { // not working on android
    //   data[group.name] = group.lessons
    // }
    for (var i = 0; i < groups.length; i++) {
      const group = groups[i];
      data[group.name] = group.lessons;
    }

    // Datasource is always in state
    this.setState({
      dataSource: ds.cloneWithRowsAndSections(data)
    });
  }

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
    const { lessonGroups, lessons } = this.props;

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
          renderItem={this.renderItem.bind(this)}
          renderSectionHeader={this.renderHeader}
          sections={[
            { title: "Title1", data: ["item1", "item2"] },
            { title: "Title2", data: ["item3", "item4"] },
            { title: "Title3", data: ["item5", "item6"] }
          ]}
          keyExtractor={(item, index) => item + index}
        />
        {/* <ListView
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        /> */}
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
    showDates: state.lesson.showDates,
    completedLessons: state.lesson.completedLessons
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // loadLesson: lesson => dispatch(LessonActions.loadLesson(lesson))
    // navigateToLesson: (lessonId) => dispatch(navigateToLesson(lessonId))
  };
};

// const enhance = withDatabase(
//   withObservables([], ({ database }) => ({
//     blogs: database.collections
//       .get("lessons")
//       .query()
//       .observe()
//     // commentCount: post.comments.observeCount()
//   }))
// );
const enhance = withObservables(["lessons"], ({ lessons }) => ({
  lessons: lessons.observe()
  // commentCount: post.comments.observeCount()
}));

// const enhance = withObservables(["lessons", "cards", "card"], (a) => {
//   console.log(a)
//   // lessons: lessons.observe()
//   // commentCount: post.comments.observeCount()
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(enhance(LessonsListScreen));
// export default enhance(LessonsListScreen);
// export default LessonsListScreen;

export default withDatabase(LessonsListScreen);

// export default withDatabase(
//   withObservables([], ({ database }) => ({
//     lessons: database.collections
//       .get("lessons")
//       .query()
//       .observe()
//   }))(LessonsListScreen)
// );

// class LessonsListScreen extends Component {
//   addComment = async () => {
//     const comment = await prompt('Write a comment')
//     await this.props.post.addComment(comment)
//   }

//   render() {
//     const { post, comments } = this.props
//     return (
//       <View>
//         <Text>ok</Text>
//       </View>
//     )
//   }
// }

// const enhancee = withObservables(['post'], ({ post }) => ({
//   post: post.observe(),
//   comments: post.comments.observe(),
// }))

// export default enhancee(LessonsListScreen)
