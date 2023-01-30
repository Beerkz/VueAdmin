import request from '@/utils/request'

const menu_api = 'system/menu/'

export default {
  // 菜单列表
  findAllMenu() {
    return request({
      url: `${menu_api}` + `findAllMenu`,
      method: 'post'
    })
  },
  // 根据id查询菜单信息
  findMenuById(id) {
    return request({
      url: `${menu_api}` + `findMenuById/${id}`,
      method: 'get'
    })
  },
  saveMenu(sysMenu) {
    return request({
      url: `${menu_api}` + `saveOrUpdate`,
      method: 'post',
      data: sysMenu
    })
  },
  updateMenu(sysMenu) {
    return request({
      url: `${menu_api}` + 'saveOrUpdate',
      method: 'post',
      data: sysMenu
    })
  },
  deleteMenuById(id) {
    return request({
      url: `${menu_api}` + `deleteMenu/${id}`,
      method: `get`
    })
  }
}
