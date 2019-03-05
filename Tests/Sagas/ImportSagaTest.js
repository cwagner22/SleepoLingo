import { select, put } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import {
  importLessonsIfNeeded,
  __test
  // __RewireAPI__ as ImportSagasRequireAPI
} from "../../App/Sagas/ImportSagas";
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

// const backupUserData = ImportSagasRequireAPI.__get__("backupUserData");

test("saves and restores user data", async () => {
  // Now that the database has been generated with seed data,
  // simulate user data modifications
  const lesson = await database.collections
    .get("lessons")
    .query()
    .fetch();

  await database.action(async () => {
    // Set the first lesson as completed
    await lesson[0].update(l => {
      l.isCompleted = true;
    });
  });

  // jest.doMock("backupUserData", () => {
  //   let data = backupUserData();
  //   console.log("data:", data);
  //   return data;
  // });

  // jest.mock("../../App/Sagas/ImportSagas", () => ({
  //   ...jest.requireActual("../../App/Sagas/ImportSagas"),
  //   backupUserData: () => {
  //     // let data = backupUserData();
  //     console.log("data:", data);
  //     // return data;
  //   }
  // }));

  // ImportSagasRequireAPI.__Rewire__("backupUserData", () => {
  //   // let data = backupUserData();
  //   // let data = ImportSagasRequireAPI.__get__("backupUserData")();
  //   // console.log("data:", data);
  //   // return data;
  // });

  // rewire$backupUserData(() => {
  //   console.log(";aaa");

  //   // let data = backupUserData();
  //   // let data = ImportSagasRequireAPI.__get__("backupUserData")();
  //   // console.log("data:", data);
  //   // return data;
  // });

  return expectSaga(importLessonsIfNeeded)
    .withReducer(
      combineReducers({
        import: reducer
      })
    )
    .call(__test.backupUserData)
    .call.fn(__test.restoreUserData)
    .dispatch(ImportActions.importLessonsIfNeeded())
    .run()
    .then(async result => {
      // Check that the first lesson is completed
      const lessons = await database.collections
        .get("lessons")
        .query(Q.where("is_completed", true))
        .fetch();
      expect(lessons.length).toEqual(1);
    });
});

// test("handles deleted data", async () => {
//   const cards = await database.collections
//     .get("cards")
//     .query()
//     .fetch();

//   await database.action(async () => {
//     // Delete one card
//     await cards[0].destroyPermanently();
//   });

//   await ImportSagasRequireAPI.__Rewire__.

//   // return expectSaga(importLessonsIfNeeded)
//   //   .withReducer(
//   //     combineReducers({
//   //       import: reducer
//   //     })
//   //   )
//   //   .dispatch(ImportActions.importLessonsIfNeeded())
//   //   .run()
//   //   .then(async result => {
//   //     // Check that the first lesson is completed
//   //     const lessons = await database.collections
//   //       .get("lessons")
//   //       .query(Q.where("is_completed", true))
//   //       .fetch();
//   //     expect(lessons.length).toEqual(1);
//   //   });
// });

// test('can be used with snapshot testing', () => {
//   return expectSaga(saga, 42)
//     .run()
//     .then((result) => {
//       expect(result.toJSON()).toMatchSnapshot();
//     });
// });
