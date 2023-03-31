import request from '@/utils/request'
const lab_api = 'secured/lab'
export default {
  // 分页查询
  page(pageCondition) {
    return request({
      url: `${lab_api}` + '/page',
      method: 'post',
      data: pageCondition
    })
  },
  getAllspliceTime() {
    return request({
      url: `${lab_api}` + '/splicetime',
      mehtod: 'get'
    })
  },
  insertLab(data) {
    return request({
      url: `${lab_api}` + '/insert',
      method: 'post',
      data: data
    })
  },
  updateLab(data) {
    return request({
      url: `${lab_api}` + '/update',
      method: 'post',
      data: data
    })
  },
  getLabInfo(id) {
    return request({
      url: `${lab_api}` + '/lab/info/' + `${id}`,
      method: 'get'
    })
  },
  deleteLab(id) {
    return request(({
      url: `${lab_api}` + '/delete/' + `${id}`,
      method: 'get'
    }))
  },
  getAllLab() {
    return request({
      url: `${lab_api}` + '/all/lab',
      method: 'post'
    })
  }

}
