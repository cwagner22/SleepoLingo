import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action } from "@nozbe/watermelondb/decorators";

export default class Card extends Model {
  static table = "cards";

  @relation("sentences", "sentence_id") sentence;
  @relation("sentences", "fullSentence_id") fullSentence;
  @field("note") note;
  @date("show_date") showDate;

  static associations = {
    lessons: { type: "belongs_to", key: "lesson_id" }
  };
  @relation("lessons", "lesson_id") lesson;

  static prepareCreate(database, sentence, fullSentence, index, note, lesson) {
    const sentencesCollection = database.collections.get("sentences");

    const newSentence = sentencesCollection.prepareCreate(s => {
      s.original = sentence.original;
      s.translation = sentence.translation;
      s.transliteration = sentence.transliteration;
    });

    let newFullSentence;
    if (
      fullSentence.original &&
      fullSentence.translation &&
      fullSentence.transliteration
    ) {
      newFullSentence = sentencesCollection.prepareCreate(s => {
        s.original = fullSentence.original;
        s.translation = fullSentence.translation;
        s.transliteration = fullSentence.transliteration;
      });
    }

    return database.collections.get("cards").prepareCreate(card => {
      card.sentence.set(newSentence);
      if (newFullSentence) card.fullSentence.set(newFullSentence);
      card.index = index;
      card.note = note;
      card.lesson.set(lesson);
    });
  }
}
