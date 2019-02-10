import { Model, Q } from "@nozbe/watermelondb";
import {
  field,
  date,
  relation,
  action,
  lazy,
  children
} from "@nozbe/watermelondb/decorators";

export default class Card extends Model {
  static table = "cards";

  @field("note") note;
  @field("index") index;
  @date("last_shown_at") lastShownAt;

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

    return !this.lastShownAt || isBefore(dateNow, dateCompare);
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
