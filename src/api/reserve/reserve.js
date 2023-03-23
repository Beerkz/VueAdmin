import request from '@/utils/request'
const reserve_api = `secured/reserve`
export default {
  reserve(data) {
    return request({
      url: `${reserve_api}` + '/start',
      method: 'post',
      data: data
    })
  },
  doReserve(data) {
    return request({
      url: `${reserve_api}` + '/do',
      method: 'post',
      data: data
    })
  },
  auditReserve(data) {
    return request({
      url: `${reserve_api}` + '/audit',
      method: 'post',
      data: data
    })
  },
  pageMyReserve(data) {
    return request({
      url: `${reserve_api}` + '/my/reserve',
      method: 'post',
      data: data
    })
  }
}
