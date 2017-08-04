import React from 'react'
import { Table } from 'antd'

const AccessStatistics = () => {
  const columns = [{
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => a.name.length - b.name.length,
  }, {
    title: '当日访问人数',
    dataIndex: 'people',
    key: 'people',
    sorter: (a, b) => a.age - b.age,
  }, {
    title: '当日访问人次',
    dataIndex: 'times',
    key: 'times',
    sorter: (a, b) => a.address.length - b.address.length,
  }, {
    title: '当日使用时间(分钟)',
    dataIndex: 'duration',
    key: 'duration',
    sorter: (a, b) => a.address.length - b.address.length,
  }, {
    title: '单次停留(分钟)',
    dataIndex: 'every_duration',
    key: 'every_duration',
    sorter: (a, b) => a.address.length - b.address.length,
  }]
  return (
    <Table columns={columns} />
  )
}
export default AccessStatistics
