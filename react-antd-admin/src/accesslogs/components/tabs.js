import React from 'react'
import { Tabs } from 'antd'
import style from './tabs.less'
import AccessStatistics from './accessstatistics'
import LogsList from './logslist'
import AccessCurve from './accesscurve/accesscurve'
import VisitStatistics from './visitstatistics/visitstatistics'

const TabPane = Tabs.TabPane

const AccesslogsTab = () => {
  return (
    <div className={style.bgColor}>
      <Tabs type="card">
        <TabPane tab="访问统计" key="1">
          <AccessStatistics />
        </TabPane>
        <TabPane tab="访问列表" key="2">
          <LogsList />
        </TabPane>
        <TabPane tab="系统访问曲线" key="3">
          <AccessCurve name="当日访问人数" />
          <AccessCurve />
          <AccessCurve />
          <AccessCurve />
        </TabPane>
        <TabPane tab="用户访问统计曲线" key="4">
          <VisitStatistics />
          <VisitStatistics />
          <VisitStatistics />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default AccesslogsTab
