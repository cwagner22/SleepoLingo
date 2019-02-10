import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

export default class Sentence extends Model {
  static table = "sentences";

  @field("original") original;
  @field("translation") translation;
  @field("transliteration") transliteration;

  // Watermelon deosn't support one-to-one relationships
  // https://github.com/Nozbe/WatermelonDB/issues/242
  // static associations = {
  //   cards: { type: "belongs_to", key: "card_id" }
  // };
  // @relation("cards", "card_id") card;
  // @lazy card = this.collections
  //   .get("cards")
  //   .query(Q.where("sentence_id", this.id));
}
