import request from '@/utils/request'

export function fetchConfig() {
  return request({
    url: '/config',
    method: 'get'
  })
}
