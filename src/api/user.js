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
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    data: { token }
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

// 修改支付密码接口
export function setPayPassword(data) {
  return request({
    url: '/user/setPayPassword',
    method: 'post',
    data
  })
}

// 修改登录密码接口
export function changeLoginPassword(data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data
  })
}

// 获取google验证码绑定接口
export function getGoogleQrcode() {
  return request({
    url: '/user/getGoogleQrcode',
    method: 'post'
  })
}
// 绑定谷歌验证码
export function bindGoogleQrcode(secret, code) {
  const data = {
    secret,
    code
  }
  return request({
    url: '/user/bindGoogleQrcode',
    method: 'post',
    data
  })
}
// 解绑谷歌验证器
export function clearGoogleBind(code) {
  const data = {
    code
  }
  return request({
    url: '/user/clearGoogleBind',
    method: 'post',
    data
  })
}
// 提交认证

export function handlerAuth(data) {
  return request({
    url: '/user/auth',
    method: 'post',
    data
  })
}

// 获取认证信息
export function getAuthInfo() {
  return request({
    url: '/user/getAuthInfo',
    method: 'post'
  })
}
// 绑定手机
export function bindMobile(mobile, code) {
  const data = {
    mobile,
    code
  }
  return request({
    url: '/user/bindmobile',
    method: 'post',
    data
  })
}
// 解除用户绑定
export function clearMobileBind(code) {
  const data = {
    code
  }
  return request({
    url: '/user/clearmobilebind',
    method: 'post',
    data
  })
}

// 获取用户操作日志的内容
export function getLogs(page) {
  const data = {
    page
  }
  return request({
    url: '/user/logs',
    method: 'post',
    data
  })
}

// 会员充值 返回跳转地址
export function recharge(data) {
  return request({
    url: '/user/recharge',
    method: 'post',
    data
  })
}

export function moneylog(data) {
  return request({
    url: '/user/moneylog',
    method: 'post',
    data
  })
}

