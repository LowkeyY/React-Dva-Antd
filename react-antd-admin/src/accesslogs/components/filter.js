import React from 'react'
import { DatePicker, Button } from 'antd'


const { RangePicker } = DatePicker

function onChange (date, dateString) {
  console.log(date, dateString)
}

const DataFilter = () => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <span style={{ paddingRight: '20px' }}>
        <RangePicker size="large" onChange={onChange} />
      </span>
      <Button type="primary" size="large" className="margin-right">搜索</Button>
    </div>
  )
}

export default DataFilter
