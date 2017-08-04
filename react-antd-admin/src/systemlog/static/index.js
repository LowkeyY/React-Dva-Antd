import { logs } from '../services'

export default {

  namespace: 'systemlogStatic',

  state: {
  },

  effects: {
    *logs ({ payload }, { select, call }) {
    	const user = yield select(({ app }) => app.user)
      	yield call(logs, { ...payload, ...user })
    },

  },

}
