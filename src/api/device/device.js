import request from '@/utils/request'

const device_api = 'secured/device'

export default {
  page(data) {
    return request({
      url: `${device_api}` + '/page',
      method: 'post',
      data: data
    })
  },
  insert(data) {
    return request({
      url: `${device_api}` + '/insert',
      method: 'post',
      data: data
    })
  },
  update(data) {
    return request({
      url: `${device_api}` + '/update',
      method: 'post',
      data: data
    })
  }
}
