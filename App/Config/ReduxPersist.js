import immutablePersistenceTransform from "../Services/ImmutablePersistenceTransform";
import dateTransform from "../Services/DateTransform";
import storage from "redux-persist/lib/storage";

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  // reducerVersion: "1.0",
  storeConfig: {
    key: "root",
    storage,
    // Reducer keys that you do NOT want stored to persistence here.
    // blacklist: ["login", "search", "nav", "github"],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    whitelist: ["import", "playback", "lesson"],
    transforms: [immutablePersistenceTransform]
  }
};

export default REDUX_PERSIST;
