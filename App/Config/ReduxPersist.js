import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform'
import dateTransform from '../Services/DateTransform'
import { AsyncStorage } from 'react-native'

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '12',
  storeConfig: {
    storage: AsyncStorage,
    blacklist: ['login', 'search'], // reducer keys that you do NOT want stored to persistence here
    // whitelist: [], Optionally, just specify the keys you DO want stored to
    // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409
    transforms: [immutablePersistenceTransform, dateTransform]
  }
}

export default REDUX_PERSIST
