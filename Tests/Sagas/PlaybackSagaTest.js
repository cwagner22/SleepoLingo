import { expectSaga } from "redux-saga-test-plan";
import {
  startNight
  // __RewireAPI__ as PlaybackSagasRequireAPI
} from "../../App/Sagas/PlaybackSagas";
import PlaybackActions, {
  reducer as playbackReducer,
  PlaybackTypes
} from "../../App/Redux/PlaybackRedux";
// import { alertReducer } from "redux-saga-rn-alert";
import { combineReducers } from "redux";
// import mock from "mock-fs";
// import fs from "fs";
// import database from "../../App/Models/database";
// import { Q } from "@nozbe/watermelondb";

// beforeAll(() => {
//   // https://github.com/tschaub/mock-fs/issues/234
//   console.log();

//   mock({
//     "lessons.test.xlsx": fs.readFileSync("./App/lessons.test.xlsx")
//   });
// });
// afterAll(() => {
//   mock.restore();
// });

test("plays", async () => {
  return (
    expectSaga(startNight)
      .withReducer(
        combineReducers({
          playback: playbackReducer,
          lesson: require("../../App/Redux/LessonRedux").reducer
          // playback: require("../../App/Redux/PlaybackRedux").reducer,
          // import: require("../../App/Redux/ImportRedux").reducer
          // alertReducer
        })
      )
      // .withReducer(reducer)

      // Assert that lessons hash updated
      // .put.actionType(PlaybackTypes.SET_LESSONS_HASH)

      // Dispatch any actions that the saga will `take`.
      .dispatch(PlaybackActions.startNight())

      // Start the test. Returns a Promise.
      .run()
      .then(async result => {
        // const lessons = await database.collections
        //   .get("lessons")
        //   .query()
        //   .fetch();
        // expect(lessons.length).toEqual(2);
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
