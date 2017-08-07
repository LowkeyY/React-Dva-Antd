import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import AccessStatistics from '../components/accessstatistics'

const AccessStatisticsRouter = (state) => {
  const { location, dispatch, accesstatistic, loading } = state
  const { list, pagination, currentItem, modalVisible} = accesstatistic
  const { pageSize } = pagination
  const listProps = {
    dataSource: list,
    loading: loading.effects['accesstatistic/getAccessList'],
    pagination,
    location,
    onChange (page) {
      const { getAccessList, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        getAccessList: {
          ...getAccessList,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onViewItem (item) {
      dispatch({
        type: 'accesstatistic/showModal',
        payload: { currentItem: item },
      })
    },
  }
  return (
    <div className="content-inner">
      <AccessStatistics {...listProps} />
    </div>
  )
}

AccessStatistics.propTypes = {
  systemlog: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ accesstatistic, loading }) => ({ accesstatistic, loading }))(AccessStatisticsRouter)
