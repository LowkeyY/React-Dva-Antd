import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const modalOpts = {
    ...modalProps,
    footer: null,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="日志日期" hasFeedback {...formItemLayout}>
          {getFieldDecorator('ENTRY_DATE', {
            initialValue: item.ENTRY_DATE,
          })(<Input />)}
        </FormItem>
        <FormItem label="日志级别" hasFeedback {...formItemLayout}>
          {getFieldDecorator('CATEGORY', {
            initialValue: item.CATEGORY,
          })(<Input />)}
        </FormItem>
        <FormItem label="日志类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('LOG_LEVEL', {
            initialValue: item.LOG_LEVEL,
          })(<Input />)}
        </FormItem>
        <FormItem label="记录者" hasFeedback {...formItemLayout}>
          {getFieldDecorator('RECORDER', {
            initialValue: item.RECORDER,
          })(<Input />)}
        </FormItem>
        <FormItem label="日志内容" hasFeedback {...formItemLayout}>
          {getFieldDecorator('CONTENT', {
            initialValue: item.CONTENT,
          })(<Input type="textarea" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
