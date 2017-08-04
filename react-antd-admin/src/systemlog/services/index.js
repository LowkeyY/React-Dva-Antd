import { request } from '../../utils'
import Cookie from 'js-cookie'

export async function query (params) {
  return request({
    url: '/bin/log/log.jjs',
    // url: 'http://192.168.0.68/sample/systemlog/Log.jcp',
    method: 'get',
    data: params,
  })
}

export function logs (params) {
  return request({
    url: '/bin/log/Log_s.jjs',
    // url: 'http://192.168.0.68/sample/systemlog/Log_s.jcp',
    method: 'post',
    data: params,
  })
}
