import React from 'react'
import { Table } from 'antd'

const LogsList = () => {
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.length - b.name.length,
  }, {
    title: '访问次数',
    dataIndex: 'times',
    key: 'times',
    sorter: (a, b) => a.age - b.age,
  }, {
    title: '使用时间',
    dataIndex: 'use_time',
    key: 'use_time',
    sorter: (a, b) => a.address.length - b.address.length,
  }, {
    title: '最后访问时间',
    dataIndex: 'last_time',
    key: 'last_time',
    sorter: (a, b) => a.address.length - b.address.length,
  }]
  return (
    <Table columns={columns} />
  )
}
export default LogsList
