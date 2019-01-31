import { Model } from "@nozbe/watermelondb";
import { field, date, relation } from "@nozbe/watermelondb/decorators";

export default class Card extends Model {
  static table = "cards";

  @relation("sentences", "sentence_id") sentence;
  @relation("sentences", "fullSentence_id") fullSentence;
  @field("note") note;
  @date("show_date") showDate;
}
