import request from '@/utils/request'

// 登录接口
export function loginByUsername(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function checkExists(field) {
  return request({
    url: '/user/exists',
    method: 'post',
    data: { field }
  })
  // return request.post('/user/exists', { field })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

