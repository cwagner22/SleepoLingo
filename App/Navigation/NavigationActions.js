// completely optional, but here's a way to create some helper action creators you can call from your app.

import { NavigationActions } from 'react-navigation'

/**
 * Creates an navigation action for dispatching to Redux.
 *
 * @param {string} routeName The name of the route to go to.
 */
const navigateTo = routeName => () => NavigationActions.navigate({ routeName })

export const navigateToLesson = navigateTo('LessonScreen')
export const navigateToLessons = navigateTo('LessonsListScreen')
export const navigateToAnki = navigateTo('AnkiScreen')
