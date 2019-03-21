import { call, select, put, race, all } from "redux-saga/effects";
import RNFS from "react-native-fs";
import { Alert } from "react-native";
import pLimit from "p-limit";
import Toast from "react-native-simple-toast";
import RNFetchBlob from "rn-fetch-blob";
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

// const getCurrentLessonId = state => state.lesson.currentLessonId;
// export function* getCurrentLesson() {
//   const res = yield database.collections
//     .get("lessons")
//     .query(Q.where("is_in_progress", true))
//     .fetch();
//   return res.length ? res[0] : null;
// }
let currentLesson;
let currentCard;

// const getCurrentCardId = state => state.lesson.currentCardId;
// export function* getCurrentCard() {
//   const currentCardId = yield select(getCurrentCardId);
//   return yield database.collections.get("cards").find(currentCardId);
// }

function* getCurrentCardsQuery() {
  return database.collections
    .get("cards")
    .query(Q.where("lesson_id", currentLesson.id));
}

export function* getCurrentCardsCount() {
  const query = yield call(getCurrentCardsQuery);
  return yield query.fetchCount();
}

export function* getCurrentSentences() {
  const query = yield call(getCurrentCardsQuery);
  const cards = yield query.fetch();
  return getCardsSentences(cards);
}

const getCardsSentences = cards => cards.map(c => c.getSentence());

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

function* restartLesson(lesson) {
  yield call(resetCardsDates, lesson);
  yield call(goToLesson, lesson);
}

function* goToLesson(lesson) {
  currentLesson = lesson;
  yield call(setLessonProgress, lesson);
  NavigationService.navigate("Lesson", { lesson });
}

export function* loadLesson({ lesson }) {
  // const lesson = yield database.collections.get("lessons").find(lessonId);

  if (lesson.isCompleted) {
    const buttons = [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start again",
        style: "default",
        call: { method: restartLesson, args: lesson }
      }
    ];

    yield call(
      alert,
      "Lesson Completed",
      "You have already completed this lesson.",
      buttons
    );
  } else {
    let done = false;
    if (!lesson.isInProgress) {
      if (currentLesson && !currentLesson.isCompleted) {
        const buttons = [
          {
            text: "Start new lesson",
            call: { method: goToLesson, args: lesson }
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

export function* loadNextCard() {
  const cards = yield currentLesson.cards.fetch();
  const sortedCards = sortCards(cards, false);
  const nextCard = sortedCards.length ? sortedCards[0] : null;
  yield put(LessonActions.setCurrentCard(nextCard.id));
  currentCard = nextCard;
  return nextCard;
}

// Moved the dispatched actions from componentWillMount since the reducers were loaded too late. (mapStateToProps,
// componentWillReceiveProps and render already called)
export function* startAnki() {
  yield put(LessonActions.startLesson());

  const nextCard = yield call(loadNextCard);
  NavigationService.navigate("Anki", {
    card: nextCard,
    lesson: currentLesson
  });
}

export function* ankiDifficulty({ difficulty }) {
  yield currentCard.ankiDifficulty(difficulty);
  yield put(LessonActions.loadNextCard());
}

export function* setLessonProgress(lesson) {
  if (!lesson.isInProgress || lesson.isCompleted) {
    let records = [];
    records.push(
      // Set the lesson as in progress
      lesson.prepareUpdate(l => {
        l.isInProgress = true;
        l.isCompleted = false;
      })
    );

    // Set last lesson as not in progress
    if (currentLesson) {
      records.push(
        currentLesson.prepareUpdate(l => {
          l.isInProgress = false;
        })
      );
    }

    yield database.batch(...records);
  }
}

function* resetCardsDates(lesson) {
  const records = lesson.cards.map(l =>
    l.prepareUpdate(l => {
      l.showAt = null;
    })
  );

  yield database.batch(...records);
}
