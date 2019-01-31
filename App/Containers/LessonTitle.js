import React from "react";
import { connect } from "react-redux";
import { HeaderTitle } from "react-navigation";

const LessonTitle = ({ currentLesson }) => (
  <HeaderTitle>{currentLesson.name}</HeaderTitle>
);

const mapStateToProps = state => {
  return {
    currentLesson: Lesson.getFromId(state.lesson.currentLessonId, true)
  };
};

export default connect(mapStateToProps)(LessonTitle);
