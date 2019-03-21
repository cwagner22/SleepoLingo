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

test("plays", async () => {
  // Create seed data
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

  return (
    expectSaga(root)
      .withReducer(
        combineReducers({
          playback: playbackReducer,
          lesson: lessonReducer
        })
      )

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
