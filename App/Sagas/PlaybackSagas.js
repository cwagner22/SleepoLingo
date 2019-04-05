import {
  call,
  put,
  fork,
  select,
  cancel,
  cancelled,
  takeEvery,
  spawn,
  all,
  delay
} from "redux-saga/effects";
import BackgroundTimer from "react-native-background-timer";
import Sound from "react-native-sound";
import moment from "moment";
import Debug from "debug";

import Player from "../Services/Player";
import loadSound from "../Services/Sound";
import PlaybackActions, { PlaybackTypes } from "../Redux/PlaybackRedux";
import LessonActions from "../Redux/LessonRedux";
import {
  ENGLISH,
  THAI,
  getCurrentLesson,
  getCurrentSentences,
  getCurrentCard,
  getCurrentCardsCount,
  setCurrentCard,
  getCurrentCards,
  setCurrentCards
} from "./LessonSagas";

const debug = Debug("app:PlaybackSaga");
// Debug.enable("app:player");

const TRANSLATION_LOOP_MAX = 3;
// const ORIGINAL_TIMEOUT = 1000
// const ORIGINAL_TIMEOUT_SLEEP = 2000
const TRANSLATION_TIMEOUT = 1000;
const TRANSLATION_TIMEOUT_SLEEP = 2000;
const NEXT_WORD_TIMEOUT = 2000;
const NEXT_WORD_TIMEOUT_SLEEP = 4000;
const REPEAT_ALL_TIMEOUT = 4000;
const REPEAT_ALL_TIMEOUT_SLEEP = 4000;

const getLessonState = state => state.lesson;
const getPlaybackState = state => state.playback;

var sound, playerLoopProcessTask, progressTask;
var playingState, lessonLoopCounter, translationLoopCounter, currentIndex;
var cachedFilesDurations;
var lessonLoopMax;

// Replicate redux-saga/delay with react-native-background-timer
const bgDelay = (ms, val = true) => {
  let timeoutId;
  const promise = new Promise(resolve => {
    timeoutId = BackgroundTimer.setTimeout(() => resolve(val), ms);
  });

  promise["@@redux-saga/cancelPromise"] = () =>
    BackgroundTimer.clearTimeout(timeoutId);

  return promise;
};

export function* playSaga({ sentence, language, volume, speed }) {
  yield call(play, sentence, language, volume, speed);
}

function* play(sentence, language, volume, speed) {
  try {
    const path = Player.getFilePath(sentence, language);
    debug(`Playing ${path}`);
    sound = yield call(loadSound, path, volume, speed);
    yield sound.promise;
    yield put(PlaybackActions.playbackSuccess());
  } catch (e) {
    console.error("Playback error");
    yield put(PlaybackActions.playbackError(e));
  } finally {
    if (yield cancelled()) {
      sound.cancel();
    }
  }
}

function* playCard() {
  const playbackState = yield select(getPlaybackState);

  const { speed, volume } = playbackState;
  const sentence = yield getCurrentCard().getSentence();
  const translation = playingState === "TRANSLATION";
  const sentenceStr = translation ? sentence.translation : sentence.original;
  const language = translation ? THAI : ENGLISH;

  yield put(PlaybackActions.setLessonLoopCounter(lessonLoopCounter));
  // yield put(LessonActions.setCurrentCard(currentCard.id));
  yield put(PlaybackActions.setPlayingState(playingState));

  yield call(
    play,
    sentenceStr,
    language,
    this.volume * volume,
    this.speed * speed
  );
}

function* playMessageEnd() {
  const playbackState = yield select(getPlaybackState);
  const { speed, volume } = playbackState;
  var sentenceStr;
  if (!isFocusMode()) {
    sentenceStr = "Good night";
  } else {
    sentenceStr = "Repeat";
  }
  yield call(
    play,
    sentenceStr,
    "en-US",
    this.volume * volume,
    this.speed * speed
  );
}

export function* playerStop() {
  // if (task) {
  //   yield cancel(task)
  // }
  // playing = false
  yield call(stopCalculateProgress);
  yield cancel(playerLoopProcessTask);
}

function* forcePlayerWithLoadedCard() {
  // playing = true
  translationLoopCounter = 0;
  playingState = "ORIGINAL";
  playerLoopProcessTask = yield fork(playerLoopProcess);
  yield call(startCalculateProgress);
  yield fork(playCard);
}

export function* playerNext() {
  yield call(playerStop);
  yield call(loadNextCard);
  yield call(forcePlayerWithLoadedCard);
}

export function* playerPrev() {
  yield call(playerStop);
  yield call(loadPrevCard);
  yield call(forcePlayerWithLoadedCard);
}

export function* playerPause() {
  yield call(playerStop);
  yield put(PlaybackActions.playbackSetPaused(true));
}

export function* playerResume() {
  yield call(forcePlayerWithLoadedCard);
}

export function* loadNextCard() {
  yield call(loadCard, true);
}

export function* loadPrevCard() {
  yield call(loadCard, false);
}

export function* loadCard(next: true) {
  playingState = "ORIGINAL";
  const lessonState = yield select(getLessonState);
  const currentCards = yield getCurrentLesson().cards.fetch();

  if (lessonState.currentCardId) {
    if (next) {
      if (++currentIndex >= currentCards.length) {
        // if (allowRestart) {
        // if (state.lessonLoopCounter < LESSON_LOOP_MAX) {
        lessonLoopCounter++;
        currentIndex = 0;
        // } else {
        //   index = currentCards.length - 1
        // }
        // } else {
        //
        // }
      }
      currentIndex = Math.max(0, currentIndex);
    } else {
      currentIndex = Math.max(0, --currentIndex);
    }
  }

  const card = getCurrentCards()[currentIndex];
  setCurrentCard(card);
  yield put(LessonActions.setCurrentCard(card.id));
}

function* loadPlayingState(action) {
  if (!playerShouldContinue()) {
    yield put(PlaybackActions.playerStop());
  }

  if (!playingState) {
    // init
    yield call(loadNextCard);
  } else if (playingState === "ORIGINAL") {
    // translation
    playingState = "TRANSLATION";
  } else if (playingState === "TRANSLATION") {
    if (++translationLoopCounter >= TRANSLATION_LOOP_MAX) {
      // next word
      const oldlessonLoopCounter = lessonLoopCounter;
      yield call(loadNextCard);
      // newState = navigateCurrentWord(state, action)
      translationLoopCounter = 0;
      if (lessonLoopCounter !== oldlessonLoopCounter) {
        playingState = "RESTART";
      }
    }
  } else if (playingState === "RESTART") {
    playingState = "ORIGINAL";
  }

  if (
    action.type === PlaybackTypes.PLAYBACK_SUCCESS &&
    playingState === "ORIGINAL"
  ) {
    yield call(restartCalculateProgress);
  }

  yield call(processPlayingState, action);
}

function* processPlayingState(action) {
  switch (playingState) {
    case "ORIGINAL":
      const init = action.type === PlaybackTypes.PLAYER_READY;
      if (!init) {
        yield call(bgDelay, this.nextWordTimeout);
      }
      // yield call(bgDelay, this.originalTimeout)
      yield call(playCard);
      break;
    case "TRANSLATION":
      yield call(bgDelay, this.translationTimeout);
      yield call(playCard);
      break;
    case "RESTART":
      yield call(setModifiers);
      yield call(bgDelay, this.nextWordTimeout);
      yield call(playMessageEnd);
      yield call(bgDelay, this.repeatAllTimeout);
      break;
  }
}

function setModifiers() {
  const _isFocusMode = isFocusMode();
  this.volume = _isFocusMode ? 1 : 0.8;

  // this.originalTimeout = _isFocusMode ? ORIGINAL_TIMEOUT : ORIGINAL_TIMEOUT_SLEEP
  this.translationTimeout = _isFocusMode
    ? TRANSLATION_TIMEOUT
    : TRANSLATION_TIMEOUT_SLEEP;
  this.nextWordTimeout = _isFocusMode
    ? NEXT_WORD_TIMEOUT
    : NEXT_WORD_TIMEOUT_SLEEP;
  this.repeatAllTimeout = _isFocusMode
    ? REPEAT_ALL_TIMEOUT
    : REPEAT_ALL_TIMEOUT_SLEEP;

  this.speed = _isFocusMode ? 0.55 : 0.45;
  // this.rateOriginal = speed
  // this.rateTranslation = speed
}

export const isFocusMode = () =>
  lessonLoopCounter < lessonLoopMax - 1 || lessonLoopMax === 1;

const playerShouldContinue = () => lessonLoopCounter < lessonLoopMax;

function* playerLoopProcess() {
  yield put(PlaybackActions.playbackSetPaused(false));
  // takeLatest cancelled the task at the end for no reason
  yield takeEvery(
    [PlaybackTypes.PLAYER_READY, PlaybackTypes.PLAYBACK_SUCCESS],
    loadPlayingState
  );
}

export function* start() {
  const playbackState = yield select(getPlaybackState);
  // const nbCards = yield call(getCurrentCardsCount);
  lessonLoopMax = playbackState.lessonLoopMax;
  // playing = true
  lessonLoopCounter = 0;
  translationLoopCounter = 0;
  currentIndex = 0;
  playingState = null;
  cachedFilesDurations = null;

  yield call(setModifiers);

  playerLoopProcessTask = yield fork(playerLoopProcess);
  yield put(PlaybackActions.playerReady()); // start playerLoopProcess

  yield fork(calculateTotalTime);
  yield call(startCalculateProgress);
}

export function* playerVolChange({ volume }) {
  if (sound) {
    sound.setVolume(volume);
  }
}

export function* playerSpeedChange() {
  if (sound) {
    const playbackState = yield select(getPlaybackState);
    sound.setSpeed(playbackState.speed);
  }

  yield fork(calculateTotalTime);
  yield call(restartCalculateProgress);
}

export function* playbackLoopMaxChange(action) {
  lessonLoopMax = action.lessonLoopMax;
  yield fork(calculateTotalTime);
}

function* calculateTotalTime() {
  debug("starting calculateTotalTime()");
  const nbCards = getCurrentCards().length;

  const filesDuration = yield call(
    durationOfFilesTotal,
    nbCards - 1,
    nbCards,
    true
  );
  const timeoutsDuration = getTimeoutsDurationTotal(nbCards - 1, nbCards, true);

  const duration = filesDuration + timeoutsDuration;

  debug(`Total duration: ${duration.toFixed()}, Files duration: ${filesDuration.toFixed()}, 
    Timeouts duration: ${timeoutsDuration.toFixed()}`);
  yield put(PlaybackActions.playbackSetDuration(duration));
}

function fileDuration(path) {
  return new Promise((resolve, reject) => {
    const _sound = new Sound(path, "", error => {
      if (error) {
        debug(`Failed to load the sound: ${path}`, error);
        reject(error);
      }

      if (!_sound.getDuration()) {
        debug(`No duration: ${path}`);
      }
      resolve(_sound.getDuration());
    });
  });
}

function* getSentenceDurations(sentence) {
  const origDuration = yield fileDuration(
    Player.getFilePath(sentence.original, ENGLISH)
  );
  const transDuration = yield fileDuration(
    Player.getFilePath(sentence.translation, THAI)
  );

  return {
    original: origDuration,
    translation: transDuration
  };
}

function* cacheFilesDurations(sentences) {
  debug("Caching files durations");

  cachedFilesDurations = yield all(
    sentences.map(s => call(getSentenceDurations, s))
  );
}

const applySpeedToFileDuration = (duration, speed) =>
  duration * 1000 * (1 / (this.speed * speed));

function* durationOfFiles(index) {
  // Return total duration of all the files played until the current index (included), for one loop
  const playbackState = yield select(getPlaybackState);
  const { speed } = playbackState;

  let duration = 0;
  for (var i = 0; i <= index; i++) {
    var cachedFileDuration = cachedFilesDurations[i];
    duration +=
      cachedFileDuration.original +
      cachedFileDuration.translation * TRANSLATION_LOOP_MAX;
  }

  return applySpeedToFileDuration(duration, speed);
}

function* durationOfFilesTotal(index, nbCards, full: boolean) {
  // Return total duration of all the files played until the current index, including previous loops.
  // If full is true, include the previous loops and the current index
  let _lessonLoopCounter;
  if (!full) {
    _lessonLoopCounter = lessonLoopCounter;
  } else {
    _lessonLoopCounter = lessonLoopMax - 1;
  }

  const playbackState = yield select(getPlaybackState);
  const { speed } = playbackState;
  if (!cachedFilesDurations) {
    const sentences = yield call(getCurrentSentences);
    yield call(cacheFilesDurations, sentences);
  }

  // todo: read real val
  const msgEndDuration = applySpeedToFileDuration(1.0, speed);
  let filesDuration = 0;
  let fullFilesDuration;
  // Duration from previous loop
  for (let i = 0; i < _lessonLoopCounter; i++) {
    if (!fullFilesDuration)
      fullFilesDuration = yield call(durationOfFiles, nbCards - 1);
    filesDuration += fullFilesDuration + msgEndDuration;
  }

  // Current loop duration
  filesDuration += yield call(durationOfFiles, full ? index : index - 1);

  if (full) filesDuration += msgEndDuration;
  return filesDuration;
}

function getTimeoutsDuration(index) {
  // Return total duration of all the timeouts played until the current index (included), for one loop
  return (
    (index + 1) *
    (TRANSLATION_TIMEOUT * TRANSLATION_LOOP_MAX + NEXT_WORD_TIMEOUT)
  );
}

function getTimeoutsDurationTotal(index, nbCards, full: boolean) {
  // Return total duration of all the timeouts played until the current index, including previous loops.
  let _lessonLoopCounter;
  if (!full) {
    _lessonLoopCounter = lessonLoopCounter;
  } else {
    _lessonLoopCounter = lessonLoopMax - 1;
  }

  let timeoutsDuration = 0;
  for (let i = 0; i < _lessonLoopCounter; i++) {
    timeoutsDuration += getTimeoutsDuration(nbCards - 1) + REPEAT_ALL_TIMEOUT;
  }
  timeoutsDuration +=
    getTimeoutsDuration(full ? index : index - 1) +
    (full ? REPEAT_ALL_TIMEOUT : 0);
  return timeoutsDuration;
}

function* getElapsedTime() {
  const playbackState = yield select(getPlaybackState);
  const cardsCount = playbackState.cardsCount;
  const filesDuration = yield call(
    durationOfFilesTotal,
    currentIndex,
    cardsCount,
    false
  );
  const timeoutsDuration = getTimeoutsDurationTotal(
    currentIndex,
    cardsCount,
    false
  );

  const duration = filesDuration + timeoutsDuration;
  debug(
    `Time previous cards - Total: ${duration.toFixed()}, Files: ${filesDuration.toFixed()}, Timeouts: ${timeoutsDuration.toFixed()}`
  );
  return duration;
}

function* startCalculateProgress() {
  progressTask = yield spawn(calculateProgress);
}

function* stopCalculateProgress() {
  if (progressTask) {
    yield cancel(progressTask);
  }
}

function* restartCalculateProgress() {
  yield call(stopCalculateProgress);
  yield call(startCalculateProgress);
}

function* calculateProgress() {
  let startTime = moment();

  while (true) {
    // If the files durations have not been cached yet then set it to 0 for now
    const elaspedTime = cachedFilesDurations ? yield call(getElapsedTime) : 0;
    const totalElaspedTime = elaspedTime + moment().diff(startTime);
    debug(
      `Time total - ${totalElaspedTime.toFixed()}, Since current card: ${moment().diff(
        startTime
      )}`
    );
    yield put(PlaybackActions.playbackSetElapsedTime(totalElaspedTime));
    yield delay(500);
  }
}

export function* startNight() {
  yield put(LessonActions.startLesson());
  // setCurrentCards(yield getCurrentLesson().cards.fetch());
  // yield put(LessonActions.loadNextCard());
  yield put(PlaybackActions.playbackSetCardsCount(getCurrentCardsCount()));
  yield put(PlaybackActions.playerStart());
}
