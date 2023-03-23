<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="实验室名称">
              <el-input v-model="pageCondition.labName" style="width: 90%" placeholder="姓名" />
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
      <el-button type="success" icon="el-icon-plus" size="mini" @click="insertUser" :disabled="$hasBP('bnt.sysUser.add') === false">添 加</el-button>
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
      <el-table-column prop="reserveName" label="预约人姓名" />
      <el-table-column prop="reserveTel" label="预约人手机" />
      <el-table-column prop="reserveDate" label="申请日期" width="160" />
      <el-table-column prop="spliceTime" label="预约时间段" width="160" />
      <el-table-column prop="statusName" label="审批状态" />
      <!--      <el-table-column prop="deptName" label="部门" />-->
      <!--      <el-table-column prop="postName" label="岗位" />-->
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
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="updateDialogVisible === false" type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { userModel } from '@/model/user/user'
import roleApi from '@/api/role/role'
import userApi from '@/api/user/user'
import reserveApi from '@/api/reserve/reserve'
import { pageCondition } from '@/model/reserve/reservelab'

export default {
  data() {
    return {
      listLoading: true,
      usermodel: userModel,
      list: [],
      total: 0,
      createTimes: [],
      dialogVisible: false,
      pageCondition: pageCondition,
      roleList: [],
      deptList: [],
      roleIds: [],
      view: false,
      updateDialogVisible: false

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
      reserveApi.pageMyReserve(this.pageCondition)
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
