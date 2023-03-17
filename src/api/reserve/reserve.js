import request from '@/utils/request'
const reserve_api = `secured/reserve`
export default {
  reserve(data){
    return request({
      url:`${reserve_api}`+'/start',
      method: 'post',
      data: data
    })
  }
}
