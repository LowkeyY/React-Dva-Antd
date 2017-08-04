import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { categorys } from '../utils'

const confirm = Modal.confirm

const List = ({ onViewItem, onSelect, location, ...tableProps }) => {
  const infosClick = (record, e) => {
    let rec = Object.assign({}, record)
    rec.LOG_LEVEL = getCategory(rec.LOG_LEVEL)
    onViewItem(rec)
    return false
  }

  const getCategory = (text) => {
    let value
    categorys.map((item, key) => { if (item.value === text) value = item.name })
    return value || text
  }

  const columns = [
    {
      title: '日志日期',
      dataIndex: 'ENTRY_DATE',
      key: 'ENTRY_DATE',
    }, {
      title: '日志级别',
      dataIndex: 'CATEGORY',
      key: 'CATEGORY',
    }, {
      title: '日志内容',
      dataIndex: 'CONTENT',
      key: 'CONTENT',
    }, {
      title: '日志类型',
      dataIndex: 'LOG_LEVEL',
      key: 'LOG_LEVEL',
      render: text => getCategory(text),
    }, {
      title: '记录者',
      dataIndex: 'RECORDER',
      key: 'RECORDER',
    }, {
      title: '其它操作',
      key: 'ACTION',
      render: (text, record) => (
        <span onClick={e => infosClick(record, e)}>
          <span className="ant-divider" />
          <a className="ant-info-circle">
            <Icon type="info-circle" /> 详细信息
          </a>
          <span className="ant-divider" />
        </span>
      ),
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      onSelect(selectedRows.length ? selectedRows[0] : {})
    },
  }

  const getBodyWrapper = body => <AnimTableBody {...getBodyWrapperProps} body={body} />

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        getBodyWrapper={getBodyWrapper}
      />
      {/* rowSelection={rowSelection}*/}
    </div>
  )
}

List.propTypes = {
  onViewItem: PropTypes.func,
  onSelect: PropTypes.func,
  location: PropTypes.object,
}

export default List
