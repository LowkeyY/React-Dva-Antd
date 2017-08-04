import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const keyValues = {
  avatar: '头像',
  name: '登录名',
  nickName: '姓名',
  age: '年龄',
  isMale: '性别',
  phone: '手机',
  email: '邮箱',
  address: '地址',
  createTime: '添加日期',
  id: '用户序号',
}

const Detail = ({ userDetail }) => {
  const { data } = userDetail
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      const test = (key === 'avatar' ? <img src={String(data[key])} /> : <div>{String(data[key])}</div>)
      content.push(<div key={key} className={styles.item}>
        <div>{keyValues[key] || key}</div>
        {test}
      </div>)
    }
  }
  return (<div className="content-inner">
    <div className={styles.content}>
      {content}
    </div>
  </div>)
}

Detail.propTypes = {
  userDetail: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ userDetail, loading }) => ({ userDetail, loading: loading.models.userDetail }))(Detail)

