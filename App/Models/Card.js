import { Model, Q } from "@nozbe/watermelondb";
import {
  field,
  date,
  relation,
  action,
  lazy,
  children
} from "@nozbe/watermelondb/decorators";
import addMinutes from "date-fns/add_minutes";
import addDays from "date-fns/add_days";
import isBefore from "date-fns/is_before";

export default class Card extends Model {
  static table = "cards";

  @field("note") note;
  @field("index") index;
  @date("show_at") showAt;

  static associations = {
    lessons: { type: "belongs_to", key: "lesson_id" }
    // one to one relationships:
    // sentences: { type: "belongs_to", key: "sentence_id" },
    // sentences: { type: "belongs_to", key: "full_sentence_id" }
  };
  @relation("lessons", "lesson_id") lesson;
  @relation("sentences", "sentence_id") sentence;
  @relation("sentences", "full_sentence_id") fullSentence;

  isReady(allowAlmost = false) {
    var dateNow = new Date();
    if (allowAlmost) {
      dateNow = addMinutes(dateNow, 1);
    }
    return !this.showAt || isBefore(this.showAt, dateNow);
  }

  async ankiDifficulty(difficulty) {
    let date = new Date();
    switch (difficulty) {
      case "hard":
        date = addMinutes(date, 1);
        break;
      case "ok":
        date = addMinutes(date, 10);
        break;
      case "easy":
      default:
        date = addDays(date, 2);
    }
    return await this.update(card => {
      card.showAt = date;
    });
  }

  // static prepareCreate(database, sentence, fullSentence, index, note, lesson) {
  //   const sentencesCollection = database.collections.get("sentences");

  //   const newSentence = sentencesCollection.prepareCreate(s => {
  //     s.original = sentence.original;
  //     s.translation = sentence.translation;
  //     s.transliteration = sentence.transliteration;
  //   });

  //   let newFullSentence;
  //   if (
  //     fullSentence.original &&
  //     fullSentence.translation &&
  //     fullSentence.transliteration
  //   ) {
  //     newFullSentence = sentencesCollection.prepareCreate(s => {
  //       s.original = fullSentence.original;
  //       s.translation = fullSentence.translation;
  //       s.transliteration = fullSentence.transliteration;
  //     });
  //   }

  //   const newCard = database.collections.get("cards").prepareCreate(card => {
  //     card.sentence.set(newSentence);
  //     if (newFullSentence) card.fullSentence.set(newFullSentence);
  //     card.index = index;
  //     card.note = note;
  //     card.lesson.set(lesson);
  //   });

  //   return {
  //     card: newCard,
  //     sentence: newSentence,
  //     fullSentence: newFullSentence
  //   };
  // }
}
