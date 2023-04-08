import request from '@/utils/request'

export function geetestInit() {
  return request({
    url: '/geetest',
    method: 'post'
  })
}
