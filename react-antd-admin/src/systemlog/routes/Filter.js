import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, DatePicker, Input, Select, Switch } from 'antd'
import { categorys } from '../utils'

const Search = Input.Search
const Option = Select.Option
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
};

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onView,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { ENTRY_DATE } = fields
    if (ENTRY_DATE.length) {
      fields.ENTRY_DATE = [ENTRY_DATE[0].format('YYYY-MM-DD'), ENTRY_DATE[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }


  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { CONTENT, CATEGORY } = filter

  let initialCreateTime = []
  if (filter.ENTRY_DATE && filter.ENTRY_DATE[0]) {
    initialCreateTime[0] = moment(filter.ENTRY_DATE[0])
  }
  if (filter.ENTRY_DATE && filter.ENTRY_DATE[1]) {
    initialCreateTime[1] = moment(filter.ENTRY_DATE[1])
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('CONTENT', { initialValue: CONTENT })(<Search placeholder="搜索内容" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('CATEGORY', { initialValue: CATEGORY })(
          <Select
            size="large"
            style={{ width: '100%' }}
            placeholder="日志类型"
            onChange={handleChange.bind(null, 'CATEGORY')}
          >
          {categorys && categorys.map((item, key) => <Select.Option value={item.value} key={key}>{item.name || item.value}</Select.Option>)}
          </Select>)}
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
        <FilterItem label="日期">
          {getFieldDecorator('ENTRY_DATE', { initialValue: initialCreateTime })(
            <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'ENTRY_DATE')} />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>
            <Button size="large" onClick={handleReset}>重置</Button>
          </div>
          <div>
            <Button size="large" type="ghost" style={{ display: 'none' }} onClick={onView}>详细信息</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onView: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
