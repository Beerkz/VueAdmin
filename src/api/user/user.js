import request from '@/utils/request'

const user_api = 'system/user'
export default {
  // 分页查询
  page(pageCondition) {
    // 接口路径
    return request({
      url: `${user_api}` + '/page',
      method: 'post',
      data: pageCondition
    })
  },
  // 添加用户
  save(sysUser) {
    return request({
      url: `${user_api}` + '/add',
      method: 'post',
      data: sysUser
    })
  },
  // 根据用户id查询
  getUserId(id) {
    return request({
      url: `${user_api}` + `/view/${id}`,
      method: 'get'
    })
  },
  // 修改
  update(sysUser) {
    return request({
      url: `${user_api}` + '/update',
      method: 'post',
      data: sysUser
    })
  },
  // 启用禁用用户
  enable(sysUser) {
    return request({
      url: `${user_api}/enable`,
      method: 'post',
      data: sysUser
    })
  },
  // 删除用户
  deleteUser(id) {
    return request({
      url: `${user_api}/delete/${id}`,
      method: 'get'
    })
  }
}
