import request from '@/utils/request'
const attachment_api = `secured/attachment/`

export default {
  uploadAttachments(files) {
    return request({
      url: `${attachment_api}` + 'uploads',
      method: 'post',
      data: files
    })
  }
}
