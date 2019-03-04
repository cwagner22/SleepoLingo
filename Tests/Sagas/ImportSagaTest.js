import { select, put } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import { importLessonsIfNeeded } from "../../App/Sagas/ImportSagas";
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
  // const a = fs.readFileSync("./App/lessons.xlsx");
  // https://github.com/tschaub/mock-fs/issues/234
  console.log("1:");

  mock({
    "lessons.test.xlsx": fs.readFileSync("./App/lessons.test.xlsx")
  });
});
afterAll(() => {
  mock.restore();
  // console.log("content:", "a");
});

// import { reducers } from "../../App/Redux";

const stepper = fn => mock => fn.next(mock).value;
test("generates the database properly", async () => {
  // const component = create(<App />);
  // const rootInstance = component.root;
  // const button = rootInstance.findByType("button");
  // button.props.onClick();
  // expect(button.props.children).toBe("PROCEED TO CHECKOUT");
  // var content = fs.readFileSync("lessons.xlsx");
  // const lesson = await database.collections
  //   .get("lessons")
  //   .query()
  //   .fetch();
  // console.log("content:", lesson);
  // return;

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
      // .call(restoreUserData)

      // Assert that lessons hash updated
      .put.actionType(ImportTypes.SET_LESSONS_HASH)

      // Dispatch any actions that the saga will `take`.
      .dispatch(ImportActions.importLessonsIfNeeded())

      // Start the test. Returns a Promise.
      .run()
      .then(async result => {
        // expect(result.returnValue.toString()).equal('@@redux-saga/TASK_CANCEL')
        const lessons = await database.collections
          .get("lessons")
          .query()
          .fetch();
        // console.log("lessons:", lessons.length);
        expect(lessons.length).toEqual(2);
      })
  );
});

test("saves user data", async () => {
  // const component = create(<App />);
  // const rootInstance = component.root;
  // const button = rootInstance.findByType("button");
  // button.props.onClick();
  // expect(button.props.children).toBe("PROCEED TO CHECKOUT");
  // var content = fs.readFileSync("lessons.xlsx");
  const lesson = await database.collections
    .get("lessons")
    .query()
    .fetch();
  console.log("lesson:", lesson);

  await database.action(async () => {
    await lesson[0].update(l => {
      l.isCompleted = true;
    });
  });

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
      // .call(restoreUserData)

      // Assert that lessons hash updated
      // .put(ImportActions.setLessonsHash("aas"))

      // Dispatch any actions that the saga will `take`.
      .dispatch(ImportActions.importLessonsIfNeeded())

      // Start the test. Returns a Promise.
      .run()
      .then(async result => {
        // expect(result.returnValue.toString()).equal('@@redux-saga/TASK_CANCEL')
        const lessons = await database.collections
          .get("lessons")
          .query(Q.where("is_completed", true))
          .fetch();
        console.log("lessons:", lessons);
        expect(lessons.length).toEqual(2);
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
