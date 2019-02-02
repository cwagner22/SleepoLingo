import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

export default class Sentence extends Model {
  static table = "sentences";

  @field("original") original;
  @field("translation") translation;
  @field("transliteration") transliteration;

  static associations = {
    cards: { type: "belongs_to", key: "card_id" }
  };
  @relation("cards", "card_id") card;
}
