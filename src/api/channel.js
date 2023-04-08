import request from '@/utils/request'

// 获取用户当前支持的接口列表
export function index() {
  return request({
    url: '/channel',
    method: 'post'
  })
}
// 获取md5秘钥
export function md5(paypassword) {
  const data = {
    paypassword
  }
  return request({
    url: '/channel/md5',
    method: 'post',
    data
  })
}

export function changeapi(data) {
  return request({
    url: '/channel/changeapi',
    method: 'post',
    data
  })
}
