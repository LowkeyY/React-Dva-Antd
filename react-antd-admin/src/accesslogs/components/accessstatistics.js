import React from 'react'
import { Table } from 'antd'

const AccessStatistics = ({ ...tableProps }, location) => {
  const columns = [{
    title: '日期',
    dataIndex: '日期',
    key: 'date',
    sorter: (a, b) => a.name.length - b.name.length,
  }, {
    title: '当日访问人数',
    dataIndex: '当日访问人数',
    key: 'people',
    sorter: (a, b) => a.age - b.age,
  }, {
    title: '当日访问人次',
    dataIndex: '当日访问人次',
    key: 'times',
    sorter: (a, b) => a.address.length - b.address.length,
  }, {
    title: '当日使用时间(分钟)',
    dataIndex: '当日使用时间(分钟)',
    key: 'duration',
    sorter: (a, b) => a.address.length - b.address.length,
  }, {
    title: '单次停留(分钟)',
    dataIndex: '单次停留(分钟)',
    key: 'every_duration',
    sorter: (a, b) => a.address.length - b.address.length,
  }]
  return (
    <Table
      {...tableProps}
      columns={columns} />
  )
}
export default AccessStatistics
