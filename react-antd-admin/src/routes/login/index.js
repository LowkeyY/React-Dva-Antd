import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import { config, md5 } from '../../utils'
import styles from './index.less'
import logo from '../../themes/image/logo.png'
import cloud10 from '../../themes/image/cloud10.png'/*
import ThreeWebGL from '../../themes/lib/ThreeWebGL.js'
import ThreeExtras from '../../themes/lib/ThreeExtras.js'
import lanrenzhijia from '../../themes/lib/lanrenzhijia.js'
import RequestAnimationFrame from '../../themes/lib/RequestAnimationFrame.js'
import Runexec from '../../themes/lib/Runexec.js'*/


const FormItem = Form.Item

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  const { loginLoading } = login

  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      values.password = md5(values.password)
      dispatch({ type: 'login/login', payload: values })
    })
  }

  return (
    <div className={styles.form} style={{ backgroundColor: 'white' }}>
      <div className={styles.logo}>
        <img alt={'logo'} src={logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '登录名必须填写',
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="登录名" autoFocus />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '密码必须填写',
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" />)}
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
            登录
          </Button>
          <p>
            <span>Username：guest</span>
            <span>Password：guest</span>
          </p>
        </Row>

      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login }) => ({ login }))(Form.create()(Login))
