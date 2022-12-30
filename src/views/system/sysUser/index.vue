<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="pageCondition.name" style="width: 90%" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名">
              <el-input v-model="pageCondition.username" style="width: 90%" placeholder="用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码">
              <el-input v-model="pageCondition.phone" style="width: 90%" placeholder="手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学号">
              <el-input v-model="pageCondition.stuNo" style=";width: 90%" placeholder="学号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px;width: 100%;"
              />
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
      <el-button type="success" icon="el-icon-plus" size="mini" @click="insertUser">添 加</el-button>
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

      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="stuNo" label="学号" />
      <el-table-column prop="phone" label="手机" />
      <el-table-column prop="deptName" label="部门" />
      <el-table-column prop="postName" label="岗位" />
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
            @change="changeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="editUser(scope.row.id)" />
          <el-button type="danger" icon="el-icon-view" size="mini" title="查看" @click="viewUser(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" />
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
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="usermodel" label-width="100px" size="small" style="padding-right: 40px;">
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <el-form-item label="登录名:" label-width="30%">
          <el-input v-model="usermodel.username" />
        </el-form-item>
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <el-form-item label="学号:" label-width="30%">
          <el-input v-model="usermodel.stuNo" />
        </el-form-item>
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <el-form-item label="手机:" label-width="30%">
          <el-input v-model="usermodel.phone" />
        </el-form-item>
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <el-form-item label="姓名:" label-width="30%">
          <el-input v-model="usermodel.name" />
        </el-form-item>
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <el-form-item label="角色:" label-width="30%">
          <el-select v-model="roleIds" placeholder="选择角色" :disabled="false" multiple>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!--          </el-col>-->
        <!--        </el-row>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { userModel, userCondition } from '@/model/user/user'
import roleApi from '@/api/role/role'
import userApi from '@/api/user/user'

export default {
  data() {
    return {
      listLoading: true,
      usermodel: userModel,
      list: [],
      total: 0,
      createTimes: [],
      dialogVisible: false,
      pageCondition: userCondition,
      roleList: [],
      deptList: [],
      roleIds: [],
      view: false

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
      userApi.page(this.pageCondition)
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
     * 改变用户状态
     * @param data
     */
    changeStatus(data) {
      this.usermodel.status = data.status
      this.usermodel.id = data.id
      userApi.enable(this.usermodel).then(response => {
        if (response.identifier === 'success') {
          this.$message({
            type: 'success',
            message: '启用成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.msg
          })
          this.listLoading = false
        }
      })
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
    insertUser() {
      this.dialogVisible = true
      this.usermodel = {}
      this.roleIds = []
    },
    saveOrUpdate() {
      if (this.view === true) {
        this.view = false
        this.dialogVisible = false
        this.page()
      } else {
        if (this.usermodel.id != null) {
          this.updateUser()
        } else {
          this.saveUser()
        }
      }
    },
    saveUser() {
      this.getRoleList()
      userApi.save(this.usermodel).then(response => {
        if (response.identifier === 'success') {
          this.$message({
            type: 'success',
            message: '插入成功'
          })
          this.dialogVisible = false
          this.page()
        } else {
          this.$message({
            type: 'error',
            message: response.msg
          })
        }
      })
    },
    updateUser() {
      this.getRoleList()
      userApi.update(this.usermodel).then(response => {
        if (response.identifier === 'success') {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.dialogVisible = false
          this.page()
        } else {
          this.$message({
            type: 'error',
            message: response.msg
          })
        }
      })
    },
    getRoleList() {
      this.usermodel.roleList = []
      for (const i in this.roleIds) {
        for (const key in this.roleList) {
          if (this.roleIds[i] === this.roleList[key].id) {
            this.usermodel.roleList.push(this.roleList[key])
          }
        }
      }
    },
    viewUser(id) {
      this.usermodel = {}
      this.roleIds = []
      userApi.getUserId(id).then(response => {
        if (response.identifier === 'success') {
          this.usermodel = response.data
          this.roleIds = []
          for (const i in this.usermodel.roleList) {
            for (const j in this.roleList) {
              if (this.usermodel.roleList[i].id === this.roleList[j].id) {
                this.roleIds.push(this.usermodel.roleList[i].id)
              }
            }
          }
          this.view = true
          this.dialogVisible = true
        } else {
          this.$message({
            type: 'error',
            message: response.msg
          })
        }
      })
    },
    editUser(id) {
      userApi.getUserId(id).then(response => {
        if (response.identifier === 'success') {
          this.usermodel = response.data
          this.roleIds = []
          for (const i in this.usermodel.roleList) {
            for (const j in this.roleList) {
              if (this.usermodel.roleList[i].id === this.roleList[j].id) {
                this.roleIds.push(this.usermodel.roleList[i].id)
              }
            }
          }
          this.view = false
          this.dialogVisible = true
        } else {
          this.$message({
            type: 'error',
            message: response.msg
          })
        }
      })
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteUser(id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            userApi.page(this.pageCondition)
              .then(response => {
                if (response.data.data.length === 0) {
                  this.pageCondition.page = this.pageCondition.page - 1
                  this.pageCondition.start = (this.pageCondition.page - 1) * this.pageCondition.limit
                  this.page(this.pageCondition)
                } else {
                  this.page(this.pageCondition)
                }
              })
          })
      })
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
