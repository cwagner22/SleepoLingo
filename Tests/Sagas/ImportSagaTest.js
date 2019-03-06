import { expectSaga } from "redux-saga-test-plan";
import {
  importLessonsIfNeeded,
  __RewireAPI__ as ImportSagasRequireAPI
} from "../../App/Sagas/ImportSagas";
import ImportActions, {
  reducer,
  ImportTypes
} from "../../App/Redux/ImportRedux";
import { combineReducers } from "redux";
import mock from "mock-fs";
import fs from "fs";
// import { reducer } from "../../App/Redux/ImportRedux";
import database from "../../App/Models/database";
import { Q } from "@nozbe/watermelondb";

beforeAll(() => {
  // https://github.com/tschaub/mock-fs/issues/234
  console.log();

  mock({
    "lessons.test.xlsx": fs.readFileSync("./App/lessons.test.xlsx")
  });
});
afterAll(() => {
  mock.restore();
});

test("generates the database properly", async () => {
  return (
    expectSaga(importLessonsIfNeeded)
      .withReducer(
        combineReducers({
          import: reducer
          // lesson: require("../../App/Redux/LessonRedux").reducer,
          // playback: require("../../App/Redux/PlaybackRedux").reducer,
          // import: require("../../App/Redux/ImportRedux").reducer
          // alertReducer
        })
      )
      // .withReducer(reducer)

      // Assert that lessons hash updated
      .put.actionType(ImportTypes.SET_LESSONS_HASH)

      // Dispatch any actions that the saga will `take`.
      .dispatch(ImportActions.importLessonsIfNeeded())

      // Start the test. Returns a Promise.
      .run()
      .then(async result => {
        const lessons = await database.collections
          .get("lessons")
          .query()
          .fetch();
        expect(lessons.length).toEqual(2);
      })
  );
});

test("saves and restores user data", async () => {
  // Now that the database has been generated with seed data,
  // simulate user data modifications
  const lesson = await database.collections
    .get("lessons")
    .query()
    .fetch();

  const cards = await database.collections
    .get("cards")
    .query()
    .fetch();

  let records = [];

  records.push(
    ...[
      lesson[0].prepareUpdate(l => {
        l.isCompleted = true;
      }),
      cards[0].prepareUpdate(c => {
        c.showAt = new Date();
      }),
      cards[1].prepareUpdate(c => {
        c.showAt = new Date();
      })
    ]
  );
  await database.batch(...records);

  // Stub internal function to delete records
  // babel-plugin-jest-hoist has been manually patched to work with jest:
  // https://github.com/facebook/jest/issues/8054
  // https://github.com/speedskater/babel-plugin-rewire/issues/212
  // https://github.com/speedskater/babel-plugin-rewire/issues/183
  // We could use babel-plugin-rewire-exports instead and export the private functions conditionally into an object
  // but it can't mock nested functions
  const restoreUserDataOrig = ImportSagasRequireAPI.__get__("restoreUserData");
  ImportSagasRequireAPI.__Rewire__("restoreUserData", function*(data) {
    yield database.action(async () => {
      // Delete one card
      await cards[0].destroyPermanently();
    });
    yield restoreUserDataOrig(data);
  });

  return expectSaga(importLessonsIfNeeded)
    .withReducer(
      combineReducers({
        import: reducer
      })
    )
    .call(ImportSagasRequireAPI.__get__("backupUserData"))
    .call.fn(ImportSagasRequireAPI.__get__("restoreUserData"))
    .dispatch(ImportActions.importLessonsIfNeeded())
    .run()
    .then(async result => {
      // Check that the first lesson is completed
      const lessons = await database.collections
        .get("lessons")
        .query(Q.where("is_completed", true))
        .fetch();
      expect(lessons.length).toEqual(1);

      const modifiedCards = await database.collections
        .get("cards")
        .query(Q.where("show_at", Q.notEq(null)))
        .fetch();

      expect(modifiedCards.length).toEqual(1);
    });
});

// test('can be used with snapshot testing', () => {
//   return expectSaga(saga, 42)
//     .run()
//     .then((result) => {
//       expect(result.toJSON()).toMatchSnapshot();
//     });
// });
