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
  }
}
