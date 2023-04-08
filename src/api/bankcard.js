import request from '@/utils/request'

// 添加银行卡
export function addBankcard(data) {
  return request({
    url: '/bankcard/add',
    method: 'post',
    data
  })
}
// 银行卡列表
export function bankcardList(data) {
  return request({
    url: '/bankcard',
    method: 'post',
    data
  })
}

// 编辑银行卡
export function editBankcard(data) {
  return request({
    url: '/bankcard/edit',
    method: 'post',
    data
  })
}
//  删除银行卡
export function delBankcard(data) {
  return request({
    url: '/bankcard/del',
    method: 'post',
    data
  })
}

// 银行卡列表审核通过
export function getNormalBankcard() {
  return request({
    url: '/bankcard/normal',
    method: 'post'
  })
}
