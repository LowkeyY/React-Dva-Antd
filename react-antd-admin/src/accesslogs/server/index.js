import { request } from '../../utils'

export async function getLogsList (params) {
  return request({
    url: '/bin/log/getstastic.jjs',
    // url: 'http://192.168.0.68/sample/systemlog/Log.jcp',
    method: 'get',
    data: params,
  })
}
