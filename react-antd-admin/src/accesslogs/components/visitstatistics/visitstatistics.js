import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const VisitStatistics = () => {
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
        <BarChart width={730} height={200} data={data}  margin={{top: 5, right: 60, left: 20, bottom: 5}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Bar dataKey="uv" fill="#82ca9d"/>
        </BarChart>
      </ResponsiveContainer>
      <h2 className="chart-type"></h2>
    </div>
  )
}

export default VisitStatistics
