export default class LessonHelper {
  constructor (store) {
    this.store = store
    this.currentLesson = store.lessons[store.currentLessonId]
  }

  currentCards () {
    if (this.currentLesson) {
      return this.currentLesson.cards.map(cId => this.store.cards[cId])
    }
  }
}
