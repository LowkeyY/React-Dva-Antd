import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Card } from 'antd'
import { Link } from 'dva/router'
import CountUp from 'react-countup'
import styles from './numberCard.less'

function NumberCard ({ icon, color, title, number, countUp }) {
  const onClick = () => { eval('alert(1)') }
  return (
      <Card className={styles.numberCard} bordered={false} bodyStyle={{ padding: 0 }} onClick={onClick}>
        <Link to="/systemlog" style={{ color: 'black' }}>
          <Icon className={styles.iconWarp} style={{ color }} type={icon} />
          <div className={styles.content}>
            <p className={styles.title}>{title || 'No Title'}</p>
            <p className={styles.number}>
              <CountUp
                start={0}
                end={number}
                duration={2.75}
                useEasing
                useGrouping
                separator=","
                {...countUp || {}}
              />
            </p>
          </div>
        </Link>
      </Card>
  )
}

NumberCard.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number,
  countUp: PropTypes.object,
}

export default NumberCard
