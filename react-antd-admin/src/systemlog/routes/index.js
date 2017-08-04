import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import { Modal as Msg } from 'antd'

const Systemlog = (state) => {
  const { location, dispatch, systemlog, loading } = state
  const { list, pagination, currentItem, modalVisible } = systemlog
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem || {},
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['systemlog/view'],
    title: '日志信息',
    wrapClassName: 'vertical-center-modal',
    onOk () {
      dispatch({
        type: 'systemlog/hideModal',
      })
    },
    onCancel () {
      dispatch({
        type: 'systemlog/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['systemlog/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onSelect (item) {
      dispatch({
        type: 'systemlog/selectRecord',
        currentItem: item,
      })
    },
    onViewItem (item) {
      dispatch({
        type: 'systemlog/showModal',
        payload: { currentItem: item },
      })
    },
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/systemlog',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/systemlog',
      }))
    },


    onView () {
      if (currentItem.ENTRY_DATE) {
        dispatch({
          type: 'systemlog/showModal',
        })
      } else {
        Msg.info({
          title: '操作提示',
          content: (
            <div>
              <p>请选择一条需要查看的数据...</p>
            </div>
          ),
          onOk () {},
        })
      }
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Systemlog.propTypes = {
  systemlog: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ systemlog, loading }) => ({ systemlog, loading }))(Systemlog)
