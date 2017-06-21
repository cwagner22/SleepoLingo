// import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
// todo: check if needed
import { Sentry } from 'react-native-sentry'
Sentry.config('https://06714e4d4729480bb04ab231d7f81056:18b95bd448d849deafb568e8ebb93649@sentry.io/181608').install()

// To show network call in devtools
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest

AppRegistry.registerComponent('SleepoLingo', () => App)
