// completely optional, but here's a way to create some helper action creators you can call from your app.

import { NavigationActions } from 'react-navigation'
import type { NavigationParams } from 'react-navigation'

const reset = (routeName: string, params?: NavigationParams) => {
  return NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName,
        params
      })
    ]
  })
}

const navigate = (routeName: string, params?: NavigationParams) => NavigationActions.navigate({routeName, params})
const navigateWrapper = (routeName: string, params?: NavigationParams) => () => navigate(routeName, params)

export const navigateToLesson = navigateWrapper('LessonScreen')
export const navigateToLessons = navigateWrapper('LessonsListScreen')
export const navigateToAnki = navigateWrapper('AnkiScreen')

export default {
  reset,
  navigate
}
