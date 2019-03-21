import { expectSaga } from "redux-saga-test-plan";
import { startNight } from "../../App/Sagas/PlaybackSagas";
import PlaybackActions, {
  reducer as playbackReducer,
  PlaybackTypes
} from "../../App/Redux/PlaybackRedux";
import LessonActions, {
  reducer as lessonReducer
} from "../../App/Redux/LessonRedux";
import root from "../../App/Sagas/index";
import { combineReducers } from "redux";
import database from "../../App/Models/database";
import Card from "../../App/Models/Card";
import Lesson from "../../App/Models/Lesson";

test("plays", async () => {
  // await new Promise(resolve => setTimeout(() => resolve(), 4000));
  // const newCard = await postsCollection.create(post => {
  //   post.title = "New post";
  //   post.body = "Lorem ipsum...";
  // });

  const lesson = database.collections.get("lessons").prepareCreate(lesson => {
    lesson.name = "Lesson 1: Essentials";
    lesson.isInProgress = true;
    lesson.isCompleted = false;
  });

  let cards = [];
  for (let i = 0; i < 10; i++) {
    cards.push(
      database.collections.get("cards").prepareCreate(card => {
        card.sentence_original = "Hi";
        card.full_sentence_translation = "หวัดดี";
        card.sentence_transliteration = "wàt dee";
        card.full_sentence_original = "Hi, how are you?";
        card.full_sentence_translation = "หวัดดี สบายดี ไหม";
        card.full_sentence_transliteration = "wàt dee sà-baai dee măi";
        card.index = i;
        card.lesson.set(lesson);
      })
    );
  }
  await database.batch(lesson, ...cards);

  // const lesson = await database.collections
  //   .get("lessons")
  //   .query()
  //   .fetch()[0];
  // console.log("lesson:", lesson);

  // const lesson = await database.collections
  // .get("lessons")
  // .query(Q.where("is_in_progress", true))
  // .fetch();

  return (
    expectSaga(root)
      .withReducer(
        combineReducers({
          playback: playbackReducer,
          lesson: lessonReducer
        })
      )
      // .withReducer(reducer)

      // Dispatch any actions that the saga will `take`.
      .dispatch(LessonActions.loadLesson(lesson))
      .dispatch(PlaybackActions.startNight())

      // // Start the test. Returns a Promise.
      .run()
  );
});

// test('can be used with snapshot testing', () => {
//   return expectSaga(saga, 42)
//     .run()
//     .then((result) => {
//       expect(result.toJSON()).toMatchSnapshot();
//     });
// });
