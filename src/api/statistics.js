import request from '@/utils/request'

// 首页统计
export function indexStatistics() {
  return request({
    url: '/statistics',
    method: 'post'
  })
}

// 首页订单图表
export function orderChart() {
  return request({
    url: '/statistics/orderChart',
    method: 'post'
  })
}

// 首页统计2
export function indexStatistics2() {
  return request({
    url: '/statistics/index2',
    method: 'post'
  })
}
