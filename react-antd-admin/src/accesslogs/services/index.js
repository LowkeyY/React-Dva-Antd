import { request } from '../../utils'

export async function getAccessList (params) {
  return request({
    url: '/bin/log/getstastic.jcp',
    // url: 'http://192.168.0.68/sample/systemlog/Log.jcp',
    method: 'get',
    data: params,
  })
}

export async function getLogsList (params) {
  return request({
    url: '/bin/log/userstat.jcp',
    // url: 'http://192.168.0.68/sample/systemlog/Log.jcp',
    method: 'get',
    data: params,
  })
}
