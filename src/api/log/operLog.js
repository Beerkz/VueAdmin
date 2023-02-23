import request from '@/utils/request'

const log_api = 'system/log/'

export default {
  // 分页查询登录日志
  page(data) {
    return request({
      url: `${log_api}` + 'page/operlog',
      method: 'post',
      data: data
    })
  },
  removeDataById(id) {
    return request({
      url: `${log_api}` + 'page/deleteOperLog/' + `${id}`,
      method: 'get'
    })
  }
}
