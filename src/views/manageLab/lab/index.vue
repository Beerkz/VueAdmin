<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="80px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="实验室名称:" label-width="30%" label-position="left">
              <el-input v-model="pageCondition.labName" />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="paged">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="insertLab">添 加</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
    >

      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{ (pageCondition.page - 1) * pageCondition.limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="labName" label="实验室名称" />
      <el-table-column prop="introduction" label="实验室简介" width="150"/>
      <el-table-column prop="capacity" label="实验室容量" width="100"/>
      <el-table-column prop="labManagerName" label="负责人姓名" width="100" />
      <el-table-column prop="managerPhone" label="负责人电话" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column
        label="是否启用"
        width="160"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            active-text="启用"
            inactive-text="禁用"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" size="mini" title="查看" @click="viewLab(scope.row.id)" />
          <el-button type="danger" icon="el-icon-edit" size="mini" title="修改" @click="updateLab(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="deleteLab(scope.row.id)" />

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="pageCondition.page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageCondition.limit"
      layout="total, sizes, prev, pager, next, jumper"
      style="padding: 30px 0; text-align: center;"
      :total="total"
      @size-change="pagesLimit"
      @current-change="pagesNum"
    />

    <!-- 弹出层 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="60%" style="overflow: auto;height: 800px">
      <el-form ref="dataForm" label-position="left" :model="labModelInfo" label-width="100%" size="small" style="padding-right: 40px;" :disabled="updateDialogVisible">
        <el-form-item label-width="20%" label="实验室头像">
          <el-upload
            action
            class="avatar-uploader"
            :http-request="addPicture"
            :file-list="fileList"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="labModelInfo.labUrl" :src="labModelInfo.labUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label-width="20%" label="实验室名称:">
          <el-input v-model="labModelInfo.labName" style="width:30%" clearable />
        </el-form-item>
        <el-form-item label="实验室简介:" label-width="20%">
          <el-input
            v-model="labModelInfo.introduction"
            style="width:80%"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入实验室简介"
          />
        </el-form-item>
        <el-form-item label-width="20%" label="实验室注意事项">
          <el-input
            v-model="labModelInfo.warning"
            style="width:80%"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="实验室注意事项"
          />
        </el-form-item>
        <el-form-item label-width="20%" label="经纬度:">
          <el-input v-model="labModelInfo.longitude" placeholder="请输入经度" style="width:30%" clearable />
          <el-input v-model="labModelInfo.latitude" placeholder="请输入维度" style="margin-left:20px;width:30%" clearable />
        </el-form-item>
        <el-form-item label="开放时间段:" label-width="20%">
          <el-select v-model="selectTime" placeholder="选择开放时间段" :disabled="false" multiple>
            <el-option
              v-for="item in timeList"
              :key="item.id"
              :label="item.spliceTime"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实验室负责人:" label-width="20%">
          <el-select v-model="labModelInfo.labManagerId" placeholder="选择负责人" :disabled="false" >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实验室人数:" label-width="20%">
          <el-input v-model="labModelInfo.capacity" placeholder="请输入实验室容量:" style="width: 30%" clearable />
        </el-form-item>
        <el-form-item />
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="updateDialogVisible === false" type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { labCondition, labModel } from '@/model/manageLab/lab'
import labApi from '@/api/manageLab/lab/lab'
import userApi from '@/api/user/user'
import attachmentApi from '@/api/attachment/attachment'
export default {
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      createTimes: [],
      dialogVisible: false,
      pageCondition: labCondition,
      view: false,
      updateDialogVisible: false,
      labModelInfo: labModel,
      userList: [],
      fileList: [],
      timeList: [],
      chooseManager: '',
      selectTime: []

    }
  },
  created() {
    // console.log(11,this.labModelInfo)
    console.log(this.pageCondition)
    this.page()
    this.getAllSpliceTime()
    this.getUserByCode()
  },
  methods: {
    /**
     * 分页查询
     */
    page() {
      labApi.page(this.pageCondition)
        .then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          console.log(response)
          if (response.identifier === 'fail') {
            debugger
            console.log(response)
            this.$message({
              type: 'error',
              message: response.msg
            })
            this.listLoading = false
          }
        })
    },
    /**
     * 分页条件查询
     */
    paged() {
      this.pageCondition.page = 1
      this.pageCondition.start = 0
      if (this.createTimes && this.createTimes.length === 2) {
        this.pageCondition.beginDate = this.createTimes[0]
        this.pageCondition.endDate = this.createTimes[1]
      }
      this.page()
    },
    /**
     * 页面页数跳转
     */
    pagesNum(pageNum) {
      this.pageCondition.page = pageNum
      this.pageCondition.start = (this.pageCondition.page - 1) * this.pageCondition.limit
      this.page(this.pageCondition)
    },
    /**
     * 页面限制条数
     */
    pagesLimit(pageLimit) {
      this.pageCondition.limit = pageLimit
      this.pageCondition.start = (this.pageCondition.page - 1) * this.pageCondition.limit
      this.page(this.pageCondition)
    },
    /**
     * 重置表单
     */
    resetData() {
      this.pageCondition.keyword = ''
      this.createTimes = ''
      this.pageCondition.phone = ''
      this.pageCondition.username = ''
      this.pageCondition.stuNo = ''
      this.pageCondition.name = ''
      this.paged()
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    addPicture(file) {
      const formDatas = new FormData()
      formDatas.append('files', file.file)
      attachmentApi.uploadAttachments(formDatas).then(response => {
        if (response.identifier === 'fail') {
          this.$message({
            type: 'error',
            message: response.msg
          })
        } else {
          this.labModelInfo.labUrl = response.data[0].fileSubUrl
        }
      })
    },
    insertLab() {
      this.labModelInfo = {}
      this.selectTime = []
      this.dialogVisible = true
    },
    getAllSpliceTime() {
      labApi.getAllspliceTime().then(response => {
        if (response.identifier === 'fail') {
          this.$message({
            type: 'error',
            message: response.msg
          })
        } else {
          this.timeList = response.data
          console.log(this.timeList)
        }
      })
    },
    saveOrUpdate() {
      this.dialogVisible = true
      if (this.view === true) {
        this.view = false
        this.dialogVisible = false
        this.page()
      } else {
        if (this.labModelInfo.id != null) {
          this.updateLabCommit()
        } else {
          this.saveLab()
        }
        this.dialogVisible = false
        this.page()
      }
    },
    saveLab() {
      this.labModelInfo.spliceTimeIds = this.selectTime
      labApi.insertLab(this.labModelInfo).then(response => {
        if (response.identifier === 'fail') {
          this.$message({
            type: 'error',
            message: response.msg
          })
        } else {
          this.dialogVisible = false
        }
      })
    },
    getUserByCode() {
      this.userList = []
      userApi.getRoleUser('MANAGER').then(response => {
        if (response.identifier === 'fail') {
          this.$message({
            type: 'error',
            message: response.msg
          })
        } else {
          this.userList = response.data
        }
      })
    },
    /**
     * 获取实验室详情信息页面
     */
    getLabInfo(id) {
      labApi.getLabInfo(id).then(response => {
        if (response.identifier === 'fail') {
          this.$message({
            type: 'error',
            message: response.msg
          })
        } else {
          this.getAllSpliceTime()
          this.labModelInfo = response.data
          this.selectTime = []
          this.labModelInfo.labManagerId = parseInt(response.data.labManagerId)
          this.labModelInfo.spliceTimeIds.forEach(item => {
            this.selectTime.push(item)
          })
        }
      })
    },
    /**
     * 查看是实验室信息
     */
    viewLab(id) {
      this.getLabInfo(id)
      this.dialogVisible = true
      this.updateDialogVisible = true
    },
    /**
     * 更新实验室信息
     * @param id
     */
    updateLab(id) {
      this.getLabInfo(id)
      this.dialogVisible = true
      this.updateDialogVisible = false
    },
    /**
     * 更新实验室信息
     */
    updateLabCommit() {
      this.labModelInfo.spliceTimeIds = this.selectTime
      labApi.updateLab(this.labModelInfo).then(response => {
        if (response.identifier === 'fail') {
          this.$message({
            type: 'error',
            message: response.msg
          })
        } else {
          this.dialogVisible = false
        }
      })
    },
    /**
     * 删除实验室
     */
    deleteLab(id){
      labApi.deleteLab(id)
      this.page()
    }

  }
}
</script>
<style>
.search-div {
  padding:10px;border: 1px solid #EBEEF5;border-radius:3px;
}
.tools-div {
  margin-top: 10px;padding:10px;border: 1px solid #EBEEF5;border-radius:3px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
