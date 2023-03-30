<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="设备名称：" label-width="40%">
              <el-input v-model="pageCondition.deviceName" style="width: 90%" placeholder="支持模糊查询" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实验室名称：" label-width="40%">
              <el-input v-model="pageCondition.labName" style="width: 90%" placeholder="支持模糊查询" />
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
      <el-button type="success" icon="el-icon-plus" size="mini" @click="insertDevice">添 加</el-button>
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

      <el-table-column prop="deviceName" label="器材名称" />
      <el-table-column prop="deviceUsage" label="器材用途" />
      <el-table-column prop="deviceParam" label="器材参数" />
      <el-table-column prop="labName" label="实验室名称" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!--          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="editUser(scope.row.id)" :disabled="$hasBP('bnt.sysUser.update')  === false"/>-->
          <!--          <el-button type="danger" icon="el-icon-view" size="mini" title="查看" @click="viewUser(scope.row.id)" :disabled="$hasBP('bnt.sysUser.list')  === false"/>-->
          <!--          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" :disabled="$hasBP('bnt.sysUser.remove')  === false"/>-->

          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="editUser(scope.row.id)" />
          <el-button type="danger" icon="el-icon-view" size="mini" title="查看" @click="viewUser(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)"/>

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
    <!-- 弹出层 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="60%" style="overflow: auto;height: 800px">
      <el-form ref="dataForm" label-position="left" :model="deviceModelInfo" label-width="100%" size="small" style="padding-right: 40px;" :disabled="updateDialogVisible">
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
            <img v-if="deviceModelInfo.deviceUrl" :src="deviceModelInfo.deviceUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label-width="20%" label="设备名称:">
          <el-input v-model="deviceModelInfo.deviceName" style="width:30%" clearable />
        </el-form-item>
        <el-form-item label-width="20%" label="设备用途:">
          <el-input v-model="deviceModelInfo.deviceUsage" style="width:30%" clearable />
        </el-form-item>
        <el-form-item label-width="20%" label="设备原理:">
          <el-input v-model="deviceModelInfo.devicePrinciple" style="width:30%" clearable />
        </el-form-item>
        <el-form-item label="分配实验室:" label-width="20%">
          <el-select v-model="deviceLabId" placeholder="选择实验室" :disabled="false">
            <el-option value="null" label="暂时不分配"></el-option>
            <el-option
              v-for="item in items"
              :key="item.id"
              :label="item.labName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="updateDialogVisible === false" type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { userModel, userCondition } from '@/model/user/user'
import roleApi from '@/api/role/role'
import attachmentApi from '@/api/attachment/attachment'
import deviceApi from '@/api/device/device'
import { pageCondition,deviceModel } from '@/model/device/device'
import { labApi } from '@/api/manageLab/lab/lab'
export default {
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      createTimes: [],
      dialogVisible: false,
      pageCondition: pageCondition,
      view: false,
      updateDialogVisible: false,
      deviceModelInfo: deviceModel,
      items:[],
      deviceLabId: ''
    }
  },
  created() {
    this.page()
    roleApi.selectAllRole().then(response => {
      if (response.identifier === 'success') {
        this.roleList = response.data
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    })
  },
  methods: {
    /**
     * 角色分页查询
     */
    page() {
      deviceApi.page(this.pageCondition)
        .then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          if (response.identifier === 'fail') {
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
          this.deviceModelInfo.deviceUrl = response.data[0].fileSubUrl
        }
      })
    },
    getAllLabInfo() {
      labApi.getAllLab().then(response=>{
        if (response.identifier === 'fail') {
          this.$message({
            type: 'error',
            message: response.msg
          })
        } else {
          this.items = response.data
        }
      })
    },
    insertDevice() {
      this.deviceModelInfo = {}
      this.dialogVisible = true
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
</style>
