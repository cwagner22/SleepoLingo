
// import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
// import App from './App/Containers/App'
import TodoApp from './components/todo-app';
// To show network call in devtools
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest

AppRegistry.registerComponent('SleepoLingo', () => TodoApp)
