import test from 'ava'
import Actions, { reducer, INITIAL_STATE } from '../../App/Redux/LessonRedux'

test('attempt', t => {
  const state = reducer(INITIAL_STATE, Actions.lessonRequest('data'))

  t.true(state.fetching)
})

test('success', t => {
  const state = reducer(INITIAL_STATE, Actions.lessonSuccess('hi'))

  t.is(state.payload, 'hi')
})

test('failure', t => {
  const state = reducer(INITIAL_STATE, Actions.lessonFailure(99))

  t.false(state.fetching)
  t.true(state.error)
})
