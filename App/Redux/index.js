import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    // https://medium.com/the-react-native-log/react-navigation-with-redux-and-immutable-js-1385c0457cb8
    // https://github.com/infinitered/ignite-ir-boilerplate/issues/38
    nav: require('../Navigation/AppNavigation').reducer,
    github: require('./GithubRedux').reducer,
    login: require('./LoginRedux').reducer,
    search: require('./SearchRedux').reducer,
    lesson: require('./LessonRedux').reducer,
    playback: require('./PlaybackRedux').reducer
  })

  return configureStore(rootReducer, rootSaga)
}
