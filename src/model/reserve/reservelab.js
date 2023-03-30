const pageCondition = {
  labName: '',
  status: '',
  spliceTimeId: '',
  reserveDate: '',
  start: 0,
  limit: 5,
  page: 1,
  username: '',
  phone: ''
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
// 我的预约信息查看实体类
const myReserveVo = {
  id: '',
  spliceTime: '',
  labName: '',
  reserveDate: '',
  teacherAuditReason: '',
  managerAuditReason: '',
  statusName: '',
  stepName: '',
  labUrl: ''
}
export {
  pageCondition,
  reserveModel,
  reserveLabVo,
  reserveReason,
  reserveAuditParam,
  myReserveVo
}
