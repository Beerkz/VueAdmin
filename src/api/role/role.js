import request from '@/utils/request'


const role_api = '/system/role'
export default{
    //分页
    page(pageCondition){
        //接口路径
        return request({
            url:`${role_api}`+'/page',
            method: 'post',
            data: pageCondition
        })
    },
    remove(id){
        //删除
        return request({
            url:`${role_api}`+'/delete/'+`${id}`,
            method: 'get',
        })
    },
    insertOrUpdateRole(sysRole){
        //插入修改
        return request({
            url:`${role_api}`+'/insertOrUpdate',
            method: 'post',
            data: sysRole
        })
    },
    getRoleId(id){
        return request({
            url:`${role_api}`+'/select/'+`${id}`,
            method: 'post'
        })
    }

}