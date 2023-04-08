import request from '@/utils/request'

export function sendSms(mobile, event) {
  const data = {
    mobile,
    event
  }
  return request({
    url: '/sms/send',
    method: 'post',
    data
  })
}
