const pageCondition = {
  labName: '',
  status: '',
  spliceTimeId: '',
  reserveDate: '',
  start: 0,
  limit: 5,
  page: 1
}
const reserveModel = {
  labId: '',
  userId: '',
  reserveDate: '',
  spliceTimeId: '',
  reason: '',
  proKey: '',
  attachments: []

}
const reserveReason = {
  id: '',
  reason: ''
}
const reserveAuditParam={
  id: '',
  proKey: '',
  reason: '',
  result: ''


}
const reserveLabVo = {
  id: '',
  beginTime: '',
  endTime: '',
  spliceTime: '',
  reserveName: '',
  reserveTel: '',
  email: '',
  reserveDate: '',
  statusName: '',
  statusCode: '',
  proKey: '',
  labName: '',
  latitude: '',
  longitude: '',
  Introduction: '',
  warning: '',
  capacity: '',
  labManagerId: '',
  labUrl: '',
  status: ''

}
export {
  pageCondition,
  reserveModel,
  reserveLabVo,
  reserveReason,
  reserveAuditParam
}
