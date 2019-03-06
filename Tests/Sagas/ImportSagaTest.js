global._get__ = null;
global.__get__ = null;

import { select, put } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import {
  importLessonsIfNeeded,
  __RewireAPI__ as ImportSagasRequireAPI
} from "../../App/Sagas/ImportSagas";
// const { restoreUserData } = __test;
import ImportActions, {
  reducer,
  ImportTypes
} from "../../App/Redux/ImportRedux";
import ImportSagas from "../../App/Sagas/ImportSagas";
import { combineReducers } from "redux";
import { create } from "react-test-renderer";
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
  const restoreUserDataOrig = ImportSagasRequireAPI.__get__("restoreUserData");
  ImportSagasRequireAPI.__Rewire__("restoreUserData", function*(data) {
    yield database.action(async () => {
      // Delete one card
      await cards[0].destroyPermanently();
    });
    yield restoreUserDataOrig(data);
  });

  return (
    expectSaga(importLessonsIfNeeded)
      .withReducer(
        combineReducers({
          import: reducer
        })
      )
      .call(ImportSagasRequireAPI.__get__("backupUserData"))
      // .call.fn(__test.restoreUserData)
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
