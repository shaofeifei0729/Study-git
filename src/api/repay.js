import request from '@/utils/request'

export function applyRepay(data) {
  return request({
    url: '/repay/apply',
    method: 'post',
    data
  })
}

export function batchApplyRepay(data) {
  return request({
    url: '/repay/batchapply',
    method: 'post',
    data
  })
}

export function repayList(data) {
  return request({
    url: '/repay',
    method: 'post',
    data
  })
}

export function repayExport(data) {
  return request({
    responseType: 'arraybuffer',
    url: '/repay/export',
    method: 'post',
    data
  })
}
