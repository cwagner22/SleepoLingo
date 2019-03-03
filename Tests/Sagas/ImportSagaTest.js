import { select, put } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import { importLessonsIfNeeded } from "../../App/Sagas/ImportSagas";
import ImportActions, { reducer } from "../../App/Redux/ImportRedux";
import ImportSagas from "../../App/Sagas/ImportSagas";
import { combineReducers } from "redux";
import { create } from "react-test-renderer";
import mock from "mock-fs";
import fs from "fs";
// import { reducer } from "../../App/Redux/ImportRedux";

beforeAll(() => {
  const a = fs.readFileSync("./App/lessons.xlsx");
  console.log("a:", a);

  mock({
    "lessons.xlsx": "a"
  });
});

// import { reducers } from "../../App/Redux";

const stepper = fn => mock => fn.next(mock).value;
test("watches for the right action", () => {
  // const component = create(<App />);
  // const rootInstance = component.root;
  // const button = rootInstance.findByType("button");
  // button.props.onClick();
  // expect(button.props.children).toBe("PROCEED TO CHECKOUT");
  var content = fs.readFileSync("lessons.xlsx");
  console.log("content:", content);

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
      // Assert that the `put` will eventually happen.
      // .put({
      //   type: "RECEIVE_USER",
      //   payload: { id: 42, name: "Tucker" }
      // })

      // Dispatch any actions that the saga will `take`.
      .dispatch(ImportActions.importLessonsIfNeeded())

      // Start the test. Returns a Promise.
      .run()
  );
});
