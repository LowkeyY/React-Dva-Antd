import { getLogsList } from '../server/index'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'

export default {

  namespace: 'accesslogs',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/accesslogs') {
          dispatch({
            type: 'getLogsList',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      payload = parse(location.search.substr(1))
      const data = yield call(getLogsList, payload)
      if (data) {
        if (data.status && data.status === 401) { yield put(routerRedux.push('/login')) } else {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.total,
              },
            },
          })
        }
      }
    },

  },

  reducers: {

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },

    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    selectRecord (state, action) {
      return { ...state, currentItem: action.currentItem }
    },

  },

}
