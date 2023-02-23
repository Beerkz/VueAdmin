<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="10">
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
          <el-col :span="12">
            <el-form-item label="登录名">
              <el-input v-model="pageCondition.username" style="width: 20%" prefix-icon="el-icon-search" placeholder="角色名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="paged">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
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
      <el-table-column prop="ipaddr" label="地址" />
      <el-table-column prop="status" label="状态" :formatter="getStatus" />
      <el-table-column prop="msg" label="提示信息" />
      <!--      <el-table-column prop="deptName" label="部门" />-->
      <!--      <el-table-column prop="postName" label="岗位" />-->
      <el-table-column prop="accessTime" label="访问时间" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
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

  </div>

</template>
<script>
import logapi from '@/api/log/loginLog'
import { logCondition } from '@/model/log/log'

export default {
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      createTimes: [],
      pageCondition: logCondition
    }
  },
  created() {
    console.log(11111)
    this.page()
  },
  methods: {
    /**
     * 分页查询
     */
    page() {
      logapi.page(this.pageCondition)
        .then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          if (response.identifier === 'fail') {
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
    /**
     * 更改状态
     */
    getStatus(row, column) {
      if (row.state === '1') {
        return '登录失败'
      } else {
        return '登录成功'
      }
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logapi.removeDataById(id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            logapi.page(this.pageCondition)
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
