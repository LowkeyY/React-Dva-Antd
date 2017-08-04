import React from 'react'
import AccesslogsTab from '../components/tabs'
import DataFilter from '../components/filter'
import { connect } from 'dva'

function Accesslogs () {

  return (
    <div>
      <DataFilter />
      <AccesslogsTab />
    </div>
  )
}
export default connect()(Accesslogs)
