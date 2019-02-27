import { call, select, put, race, all } from "redux-saga/effects";
import RNFS from "react-native-fs";
import { Alert } from "react-native";
import pLimit from "p-limit";
import Toast from "react-native-simple-toast";
import RNFetchBlob from "rn-fetch-blob";
// import Debug from "debug";
import { Q } from "@nozbe/watermelondb";
import { alert } from "redux-saga-rn-alert";

import API from "../Services/TranslateApi";
import LessonActions from "../Redux/LessonRedux";
import NavigationActions, {
  navigateToAnki,
  navigateToLesson
} from "../Navigation/NavigationActions";
import NavigationService from "../Services/NavigationService";
import Player from "../Services/Player";
import database from "../Models/database";

export const THAI = "th-TH";
export const ENGLISH = "en-US";
const api = API.create();
import Debug from "debug";
const debug = Debug("app:LessonSagas");

const limit = pLimit(5);

const isCompleted = (state, lessonId) =>
  !!state.lesson.completedLessons[lessonId];

const getCurrentLessonId = state => state.lesson.currentLessonId;
export function* getCurrentLesson() {
  const currentLessonId = yield select(getCurrentLessonId);
  return yield database.collections.get("lessons").find(currentLessonId);
}

function* getCurrentCardsQuery() {
  const currentLessonId = yield select(getCurrentLessonId);
  return database.collections
    .get("cards")
    .query(Q.where("lesson_id", currentLessonId));
}

export function* getCurrentSentences() {
  const query = yield call(getCurrentCardsQuery);
  const cards = yield query.fetch();
  return getCardsSentences(cards);
}

export function* getCurrentCardsCount() {
  const query = yield call(getCurrentCardsQuery);
  return yield query.fetchCount();
}

const getCardsSentences = cards => cards.map(c => c.getSentence());

const getCurrentCardId = state => state.lesson.currentCardId;
export function* getCurrentCard() {
  const currentCardId = yield select(getCurrentCardId);
  return yield database.collections.get("cards").find(currentCardId);
}

const downloadSentence = (sentence, language) => {
  const path = Player.getFilePath(sentence, language);
  const url = api.ttsURL(sentence, language);

  return RNFetchBlob.config({
    fileCache: true,
    path
  })
    .fetch("GET", url)
    .then(res => {
      debug("The file saved to ", res.path());
      return res;
    });
};

export function* filterSentencesNotCached(sentences, language) {
  const path = Player.getLanguagePath(language);
  debug("Audio cache", path);
  yield call(RNFS.mkdir, path, { NSURLIsExcludedFromBackupKey: true });

  const files = yield call(RNFS.readDir, path);
  return sentences.filter(s => {
    const filePath = Player.getFilePath(s, language);
    for (let file of files) {
      if (file.path === filePath) {
        return false;
      }
    }

    return true;
  });
}

const createCacheFolderIfNeeded = () => {
  var cachePath = RNFS.DocumentDirectoryPath + "/cache";
  return RNFS.exists(cachePath).then(exists => {
    if (!exists) {
      return RNFS.mkdir(cachePath, { NSURLIsExcludedFromBackupKey: true });
    }
  });
};

export function* downloadLesson({ cards }) {
  let sentencesOriginal = [],
    sentencesTranslation = [];
  for (const c of cards) {
    sentencesOriginal.push(c.sentenceOriginal);
    sentencesTranslation.push(c.sentenceTranslation);

    if (c.fullSentenceOriginal) {
      sentencesOriginal.push(c.fullSentenceOriginal);
      sentencesTranslation.push(c.fullSentenceTranslation);
    }
  }
  sentencesOriginal = sentencesOriginal.concat(["Repeat", "Good night"]);

  sentencesOriginal = yield call(
    filterSentencesNotCached,
    sentencesOriginal,
    ENGLISH
  );
  sentencesTranslation = yield call(
    filterSentencesNotCached,
    sentencesTranslation,
    THAI
  );

  if (sentencesOriginal.length || sentencesTranslation.length) {
    try {
      Toast.show("Downloading lesson for offline use");
      // yield call(createCacheFolderIfNeeded);

      yield all(
        sentencesOriginal.map(s =>
          call(limit, () => downloadSentence(s, ENGLISH))
        )
      );
      yield all(
        sentencesTranslation.map(s =>
          call(limit, () => downloadSentence(s, THAI))
        )
      );

      Toast.show("Download completed");
    } catch (error) {
      debug("Download error", error);
      Toast.show("Download error: " + error.message);
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

function* goToLesson(lesson) {
  yield put(LessonActions.setCurrentLesson(lesson.id));
  NavigationService.navigate("Lesson", { lesson });
}

export function* loadLesson({ lesson }) {
  // const lesson = yield database.collections.get("lessons").find(lessonId);

  if (lesson.isCompleted) {
    const cancel = bindCallbackToPromise();
    const confirm = bindCallbackToPromise();

    Alert.alert("Lesson Completed", "You have already completed this lesson.", [
      { text: "Start again", onPress: confirm.cb },
      { text: "Cancel", onPress: cancel.cb }
    ]);

    // The race will wait for either the cancel or confirm callback to be invoked - which skirts
    // around the problem of trying to "put" from within a callback: don't put an event, instead
    // rely strictly on the resolution of a promise
    const res = yield race({
      cancel: call(cancel.promise),
      confirm: call(confirm.promise)
    });

    yield call(processLessonAlert, res, lessonId);
  } else {
    let done = false;
    const currentLessonId = yield select(getCurrentLessonId);
    if (lesson.id !== currentLessonId && currentLessonId) {
      const currentLesson = yield database.collections
        .get("lessons")
        .find(currentLessonId);

      if (!currentLesson.isCompleted) {
        const buttons = [
          {
            text: "Start new lesson",
            call: { method: goToLesson, args: currentLesson }
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ];

        yield call(
          alert,
          "New Lesson",
          "You have another lesson in progress.",
          buttons
        );

        done = true;
      }
    }

    if (!done) {
      yield goToLesson(lesson);
    }
  }
}

function sortCards(cards, allowAlmost = false) {
  var sortedCardsReady = cards
    .sort((a, b) => a.index - b.index)
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
  return yield database.collections.get("lessons").find(currentLessonId);
}

function* getCurrentCard() {
  const currentCardId = yield select(getCurrentCardId);
  return yield database.collections.get("cards").find(currentCardId);
}

export function* loadNextCard() {
  currentLesson = yield call(getCurrentLesson);

  const cards = yield currentLesson.cards.fetch();
  const sortedCards = sortCards(cards, false);
  const nextCard = sortedCards.length ? sortedCards[0] : null;
  yield put(LessonActions.setCurrentCard(nextCard.id));
  return nextCard;
}

// Moved the dispatched actions from componentWillMount since the reducers were loaded too late. (mapStateToProps,
// componentWillReceiveProps and render already called)
export function* startAnki() {
  yield put(LessonActions.startLesson());

  const nextCard = yield call(loadNextCard);
  const lesson = yield call(getCurrentLesson);
  NavigationService.navigate("Anki", {
    card: nextCard,
    lesson
  });
}

export function* ankiDifficulty(difficulty) {
  const currentCard = yield call(getCurrentCard);
  yield currentCard.ankiDifficulty(difficulty);

  yield put(LessonActions.loadNextCard());
}
