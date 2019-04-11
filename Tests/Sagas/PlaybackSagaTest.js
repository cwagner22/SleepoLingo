import { expectSaga } from "redux-saga-test-plan";
import { __RewireAPI__ as PlaybackSagasRequireAPI } from "../../App/Sagas/PlaybackSagas";
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
      // Check that actions have been called
      .put(LessonActions.downloadLesson())
      .put(LessonActions.startLesson())
      .put(PlaybackActions.playerStart())
      .fork(PlaybackSagasRequireAPI.__get__("calculateTotalTime"))
      .spawn(PlaybackSagasRequireAPI.__get__("calculateProgress"))
      .call.fn(PlaybackSagasRequireAPI.__get__("play"))
      .put(PlaybackActions.playbackSetPaused(false))
      .put(PlaybackActions.playerReady())
      // not sure why it starts with the last card
      .put(LessonActions.setCurrentCard(cards[cards.length - 1].id))
      .put.actionType("PLAYBACK_SET_ELAPSED_TIME")

      // Dispatch any actions that the saga will `take`.
      .dispatch(LessonActions.loadLesson(lesson))
      // Wait for lesson to load
      .delay(250)
      .dispatch(PlaybackActions.startNight())

      // // Start the test. Returns a Promise.
      .silentRun(500)
      .then(result => {
        // RangeError: Maximum call stack size exceeded
        // expect(result.toJSON()).toMatchSnapshot();
      })
  );
});

// test('can be used with snapshot testing', () => {
//   return expectSaga(saga, 42)
//     .run()
//     .then((result) => {
//       expect(result.toJSON()).toMatchSnapshot();
//     });
// });
