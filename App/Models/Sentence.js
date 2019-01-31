import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class Sentence extends Model {
  static table = "sentences";

  @field("original") original;
  @field("translation") translation;
  @field("transliteration") transliteration;
}
