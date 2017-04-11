export default class LessonHelper {
  constructor (store) {
    this.store = store
    this.currentLesson = store.lessons[store.currentLessonId]
  }

  currentWords () {
    return this.currentLesson.words.map(wId => this.store.words[wId])
  }

  wordWithDate (word) {
    return {
      ...word,
      showDate: this.state.cardsDates[word.id]
    }
  }
}
