// @flow
// https://github.com/rt2zz/redux-persist/issues/82

import Time from './Time'
import traverse from 'traverse'
// import moment from 'moment'

export default {
  out: (state: Object) => {
    return traverse(state).map((val) => {
      if (Time.isISOStringDate(val)) {
        // moment causes infinite loop...
        return new Date(val)
      }

      return val
    })
  },
  in: (raw: Object) => {
    return raw
  }
}
