import request from '@/utils/request'

// 代理开户
export function adduser(data) {
  return request({
    url: '/agent/adduser',
    method: 'post',
    data
  })
}
// 查看所有的商户
export function userlist(data) {
  return request({
    url: '/agent/userlist',
    method: 'post',
    data
  })
}

// 查看下级商户的费率
export function userrate(merchant_id) {
  const data = {
    merchant_id
  }
  return request({
    url: '/agent/userrate',
    method: 'post',
    data
  })
}

export function setuserrate(data) {
  return request({
    url: '/agent/setuserrate',
    method: 'post',
    data
  })
}
// 查看代理订单
export function orderlist(data) {
  return request({
    url: '/agent/orderlist',
    method: 'post',
    data
  })
}

export function agentDetail() {
  return request({
    url: '/agent/detail',
    method: 'post'
  })
}

export function changeBio(data) {
  return request({
    url: '/agent/changebio',
    method: 'post',
    data
  })
}
