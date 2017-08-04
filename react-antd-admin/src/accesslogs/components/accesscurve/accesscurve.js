import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './style.less'
const AccessCurve = () => {
  const data = [
    {name: 'Page A', uv: 33, amt: 2400},
    {name: 'Page B', uv: 3000, amt: 2210},
    {name: 'Page C', uv: 2000, amt: 2290},
    {name: 'Page D', uv: 2780, amt: 2000},
    {name: 'Page E', uv: 1890, amt: 2181},
    {name: 'Page F', uv: 2390, amt: 2500},
    {name: 'Page G', uv: 3490, amt: 2100},
  ];
  return (
    <div>
      <ResponsiveContainer minHeight={360}>
        <LineChart width={600} height={200} data={data}
                   margin={{top: 5, right: 60, left: 20, bottom: 5}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Line type="monotone" dataKey="uv" stroke="#64ea91" dot={{ fill:" #64ea91" }}/>
        </LineChart>
      </ResponsiveContainer>
      <h2 className="chart-type"></h2>
    </div>
  )
}

export default AccessCurve

