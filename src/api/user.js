import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'system/secured/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: 'system/secured/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'system/secured/logout',
    method: 'post'
  })
}
