<template>
  <div>
    <div class="app-container">
      <!--查询表单-->
      <div class="search-div">
        <el-form label-width="70px" size="small">
          <el-row>
            <el-col :span="24">
              <el-form-item label="角色名称">
                <el-input v-model="pageCondition.roleName" style="width: 20%" prefix-icon="el-icon-search" placeholder="角色名称" />
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
        <el-button type="success" icon="el-icon-plus" size="mini" @click="insertRole" :disabled="$hasBP('bnt.sysRole.add') === false">添 加</el-button>
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

        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.id)" :disabled="$hasBP('bnt.sysRole.update')  === false"/>
            <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" :disabled="$hasBP('bnt.sysRole.remove')  === false"/>
            <el-button type="view" icon="el-icon-view" size="mini" title="查看" @click="view(scope.row.id)" :disabled="$hasBP('bnt.sysRole.list')  === false"/>
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
      <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
        <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;" :disabled="updateDialogVisible">
          <el-form-item label="角色名称">
            <el-input v-model="sysRole.roleName" blur="" />
          </el-form-item>
          <el-form-item label="角色编码">
            <el-input v-model="sysRole.roleCode" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="sysRole.description" />
          </el-form-item>
          <el-form-item v-if="showCheckbox === true" label="权限赋予">
            <el-tree
              ref="tree"
              :data="sysMenuList"
              node-key="id"
              show-checkbox
              :props="defaultProps"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false;showCheckbox=true;updateDialogVisible=false">取 消</el-button>
          <el-button v-if="updateDialogVisible!=true" type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- <el-pagination
                :current-page="pageCondition.page"
                :total="total"
                :page-size="pageCondition.limit"
                style="padding: 30px 0; text-align: center;"
                layout="total, prev, pager, next, jumper"
                @current-change="pages"
            /> -->
    </div>
  </div>
</template>

<script>
import api from '@/api/role/role'
import menuApi from '@/api/menu/menu'
import { RoleModel } from '@/model/role/role'
export default {
  data() {
    return {
      listLoading: false, // 是否显示加载图标
      list: [],
      total: 0,
      // 弹窗是否可以更改
      updateDialogVisible: false,
      dialogVisible: false,
      pageCondition: {
        roleName: '',
        limit: 5,
        page: 1,
        start: 0
      },
      sysRole: RoleModel,
      sysMenuList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
      showCheckbox: false

    }
  },
  created() {
    this.page()
  },
  methods: {
    /**
         * 角色分页查询
         */
    page() {
      api.page(this.pageCondition)
        .then(response => {
          this.list = response.data.data
          this.total = response.data.total
        })
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
      this.pageCondition.roleName = null
      this.pageCondition.page = 1
      this.pageCondition.start = 0
      this.page(this.pageCondition)
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.remove(id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            api.page(this.pageCondition)
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
    },
    //  添加按钮
    insertRole() {
      // 关闭权限树
      this.showCheckbox = false
      this.dialogVisible = true
      this.sysRole = {}
    },
    /**
     * 获取角色权限
     * @param id
     */
    fetchData(id) {
      // 打开用户权限树展示
      this.showCheckbox = true
      menuApi.toAssign(id).then(response => {
        this.sysMenuList = {}
        this.sysMenuList = response.data
        const sysMenuList = this.sysMenuList
        const checkedIds = this.getCheckedIds(sysMenuList)
        this.$refs.tree.setCheckedKeys(checkedIds)
      })
    },
    view(id) {
      this.fetchData(id)
      this.updateDialogVisible = true
      this.showCheckbox = true
      api.getRoleId(id).then(response => {
        this.sysRole.id = response.data.id
        this.sysRole.roleName = response.data.roleName
        this.sysRole.roleCode = response.data.roleCode
        this.sysRole.description = response.data.description
        this.dialogVisible = true
      })
    },
    /**
     得到所有选中的id列表
     */
    getCheckedIds(auths, initArr = []) {
      return auths.reduce((pre, item) => {
        if (item.select && (item.children == null || item.children.length === 0)) {
          pre.push(item.id)
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr)
        }
        return pre
      }, initArr)
    },
    // 修改按钮
    edit(id) {
      // 启用更改
      this.updateDialogVisible = false
      this.fetchData(id)
      api.getRoleId(id).then(response => {
        this.sysRole.id = response.data.id
        this.sysRole.roleName = response.data.roleName
        this.sysRole.roleCode = response.data.roleCode
        this.sysRole.description = response.data.description
        this.dialogVisible = true
      })
    },
    saveOrUpdate() {
      if (this.sysRole.id != null) {
        this.updateRole()
        this.getCheckedNodes(this.sysRole.id)
      } else {
        debugger
        this.saveRole()
        // 关闭权限树
        this.showCheckbox = false
      }
    },
    //  添加方法
    saveRole() {
      api.insertOrUpdateRole(this.sysRole).then(response => {
        if (response.identifier === 'success') {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.dialogVisible = false
          this.page(this.pageCondition)
        }
      })
    },
    /**
     * 分页条件查询
     */
    paged() {
      this.pageCondition.page = 1
      this.pageCondition.start = 0
      this.page()
    },
    updateRole() {
      api.insertOrUpdateRole(this.sysRole).then(response => {
        if (response.identifier === 'success') {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.dialogVisible = false
          this.page(this.pageCondition)
        } else {
          this.$message({
            type: 'fail',
            message: response.data.msg
          })
        }
      })
    },
    getCheckedNodes(id) {
      // 获取到当前子节点
      // const checkedNodes = this.$refs.tree.getCheckedNodes()
      // 获取到当前子节点及父节点
      const allCheckedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const idList = allCheckedNodes.map(node => node.id)
      const assginMenuVo = {
        roleId: id,
        menuIdLists: idList
      }
      this.loading = true
      menuApi.doAssign(assginMenuVo).then(result => {
        this.loading = false
        this.$message.success(result.msg || '分配权限成功')
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
