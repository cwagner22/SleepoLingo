import { call, select, put, race } from "redux-saga/effects";
import RNFS from "react-native-fs";
import { Alert } from "react-native";
import Promise from "bluebird";
import Toast from "react-native-simple-toast";
import RNFetchBlob from "rn-fetch-blob";

import API from "../Services/TranslateApi";
import LessonActions from "../Redux/LessonRedux";
import NavigationActions, {
  navigateToAnki,
  navigateToLesson
} from "../Navigation/NavigationActions";
import NavigationService from "../Services/NavigationService";
import Player from "../Services/Player";
import DBInstance from "../Models/DBInstance";

const db = DBInstance.getCurrentDB();
const api = API.create();

const getCurrentLessonId = state => state.lesson.currentLessonId;
const isCompleted = (state, lessonId) =>
  !!state.lesson.completedLessons[lessonId];

const downloadItem = item => {
  const path = Player.getFilePath(item.sentence, item.language);
  const url = api.ttsURL(item.sentence, item.language);

  // saga progress: https://stackoverflow.com/questions/41616861/calling-yield-inside-react-redux-saga-callback
  return RNFetchBlob.config({
    fileCache: true,
    path
  })
    .fetch("GET", url)
    .then(res => {
      console.log("The file saved to ", res.path());
    });
};

const downloadAll = items => {
  return Promise.map(items, downloadItem, {
    concurrency: 5
  });
};

export function* getItemsNotCached(items, language) {
  const path = Player.getLanguagePath(language);
  console.log("Audio cache", path);
  yield call(RNFS.mkdir, path, { NSURLIsExcludedFromBackupKey: true });

  const files = yield call(RNFS.readDir, path);
  const itemsNotCached = items
    .filter(item => item.language === language)
    .filter(item => {
      const filePath = Player.getFilePath(item.sentence, language);
      for (let file of files) {
        if (file.path === filePath) {
          return false;
        }
      }

      return true;
    });

  return itemsNotCached;
}

export function* downloadLesson(action) {
  const { currentCards } = action;

  var items = [];
  for (var i = 0; i < currentCards.length; i++) {
    const c = currentCards[i];
    items = items.concat([
      {
        sentence: c.sentence.original,
        language: "en-US"
      },
      {
        sentence: c.sentence.translation,
        language: "th-TH"
      }
    ]);

    if (c.fullSentence) {
      items = items.concat([
        {
          sentence: c.fullSentence.original,
          language: "en-US"
        },
        {
          sentence: c.fullSentence.translation,
          language: "th-TH"
        }
      ]);
    }
  }
  items = items.concat([
    {
      sentence: "Repeat",
      language: "en-US"
    },
    {
      sentence: "Good night",
      language: "en-US"
    }
  ]);

  let itemsToDownload = yield call(getItemsNotCached, items, "en-US");
  const itemsToDownloadTrans = yield call(getItemsNotCached, items, "th-TH");
  itemsToDownload = itemsToDownload.concat(itemsToDownloadTrans);

  if (itemsToDownload.length) {
    try {
      Toast.show("Downloading lesson for offline use");
      yield call(downloadAll, itemsToDownload);
      Toast.show("Download completed");
    } catch (error) {
      console.error("Download error", error);
      Toast.show("Download error" + error);
    }
  }
}

// Because of the way "call" works, if we want to "put" an action
// after a callback is invoked, we can return a promise that is
// bound to resolve when the callback is invoked
function bindCallbackToPromise() {
  let _resolve;
  const promise = () => {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  };
  const cb = args => _resolve(args);

  return {
    promise,
    cb
  };
}

function* processLessonAlert(res, lessonId) {
  if (res.hasOwnProperty("confirm")) {
    yield put(LessonActions.resetDates());
    yield put(LessonActions.setCurrentLesson(lessonId));
    yield put(LessonActions.lessonUpdateCompleted(false));
    yield put(navigateToLesson());
  } else {
    // yield call(NavigatorService.reset, 'LessonsListScreen')
  }
}

export function* loadLesson({ lesson }) {
  yield put(LessonActions.setCurrentLesson(lesson.id));
  // NavigationActions.navigate({ routeName: "LessonScreen" });
  NavigationService.navigate("LessonScreen", { lesson });
  // const currentLessonId = yield select(getCurrentLessonId);
  // const completed = yield select(isCompleted, lessonId);
  // const currentLessonCompleted = yield select(isCompleted, currentLessonId);

  // if (completed) {
  //   const cancel = bindCallbackToPromise();
  //   const confirm = bindCallbackToPromise();

  //   Alert.alert("Lesson Completed", "You have already completed this lesson.", [
  //     { text: "Start again", onPress: confirm.cb },
  //     { text: "Cancel", onPress: cancel.cb }
  //   ]);

  //   // The race will wait for either the cancel or confirm callback to be invoked - which skirts
  //   // around the problem of trying to "put" from within a callback: don't put an event, instead
  //   // rely strictly on the resolution of a promise
  //   const res = yield race({
  //     cancel: call(cancel.promise),
  //     confirm: call(confirm.promise)
  //   });

  //   yield call(processLessonAlert, res, lessonId);
  // } else if (!currentLessonCompleted && lessonId !== currentLessonId) {
  //   const cancel = bindCallbackToPromise();
  //   const confirm = bindCallbackToPromise();

  //   Alert.alert("New Lesson", "You have another lesson in progress.", [
  //     { text: "Start new lesson", onPress: confirm.cb },
  //     { text: "Cancel", onPress: cancel.cb }
  //   ]);

  //   // The race will wait for either the cancel or confirm callback to be invoked - which skirts
  //   // around the problem of trying to "put" from within a callback: don't put an event, instead
  //   // rely strictly on the resolution of a promise
  //   const res = yield race({
  //     cancel: call(cancel.promise),
  //     confirm: call(confirm.promise)
  //   });

  //   yield call(processLessonAlert, res, lessonId);
  // } else {
  //   yield put(LessonActions.setCurrentLesson(lessonId));
  //   yield put(navigateToLesson());
  // }
}

function sortCards(cards, allowAlmost = false) {
  var sortedCardsReady = cards
    .sort(c => c.index)
    .filter(card => {
      // Exclude future cards
      return card.isReady(allowAlmost);
    });

  if (!sortedCardsReady.length && !allowAlmost) {
    return sortCards(cards, true);
  } else {
    return sortedCardsReady;
  }
}

function* getCurrentLesson() {
  const currentLessonId = yield select(getCurrentLessonId);

  return yield db.collections.get("lessons").find(currentLessonId);
}

async function loadNextCard(currentLesson) {
  // const currentLesson = await db.collections
  //   .get("lessons")
  //   .find(currentLessonId);

  const cards = await currentLesson.cards.fetch();
  const sortedCards = sortCards(cards, false);
  return sortedCards.length ? sortedCards[0] : null;
}

// Moved the dispatched actions from componentWillMount since the reducers were loaded too late. (mapStateToProps,
// componentWillReceiveProps and render already called)
export function* startAnki() {
  yield put(LessonActions.startLesson());

  currentLesson = yield call(getCurrentLesson);

  const nextCard = yield call(loadNextCard, currentLesson);

  yield put(LessonActions.setCurrentCard(nextCard.id));
  // const currentLesson = Lesson.getFromId(state.currentLessonId, true);
  // const sortedCards = sortCards(currentLesson.cards, false);
  // console.log(sortedCards);
  // yield put(LessonActions.loadNextCard());
  // yield put(navigateToAnki());
  NavigationService.navigate("AnkiScreen", {
    card: nextCard,
    lesson: currentLesson
  });
}
