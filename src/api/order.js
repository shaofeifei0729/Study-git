import request from '@/utils/request'

// 登录接口
export function orderList(data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}

export function exportList(data) {
  return request({
    responseType: 'arraybuffer',
    url: '/order/export',
    method: 'post',
    data
  })
}
