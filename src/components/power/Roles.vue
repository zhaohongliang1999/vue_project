<template>
    <div>
   <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <el-table :data="rolelist" border stripe>
            <!-- 展开列 -->
             <el-table-column type="expand">
                 <template slot-scope="scope">
                   <el-row :class="['bdbottom' , i1 === 0 ? 'bdtop' : '' ,'vcenter']" v-for=" (item1, i1) in scope.row.children" :key="item1.id">
                       <!-- 渲染一级权限 -->
                       <el-col :span="5">
                         <el-tag>{{item1.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                       </el-col>
                       <!-- 渲染二级和三级权限 -->
                       <el-col :span="19">
                         <!-- 通过for循环 嵌套渲染二级权限 -->
                         <el-row :class="[i2 === 0 ? '' : 'bdtop' ,'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                           <el-col :span="6">
                             <el-tag type="success">{{item2.authName}}</el-tag>
                               <i class="el-icon-caret-right"></i>
                           </el-col>
                           <el-col :span="18">
                             <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">
                               {{item3.authName}}
                             </el-tag>
                           </el-col>
                         </el-row>
                       </el-col>
                   </el-row>
                 </template>
             </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px" >
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
      <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName" ></el-input>
        </el-form-item>
              <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
         // 所有角色列表数据
           rolelist : [],
        //    控制添加弹出框显示隐藏
           addDialogVisible : false,
           // 控制修改弹出框显示隐藏
           editDialogVisible : false,
       // 添加用户的表单数据
     addForm: {
       roleId : '',
       roleName : '',
       roleDesc : ''
      },
       // 添加用户的表单验证规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在 3 到 10 个字符之间',
            trigger: 'blur'
          }
        ],
         roleDesc: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在 3 到 10 个字符之间',
            trigger: 'blur'
          }
        ],
      }
        }
    },
    created() {
        this.getRolesList()
    },
    methods : {
        // 获取所有角色的列表
        async getRolesList() {
           const {data : res} = await this.$http.get('roles') 
           if (res.meta.status !== 200) {
               return this.$message.error('获取角色列表失败')
           }
           this.rolelist = res.data
        },
         // 监听添加用户对话框的关闭事件
         addDialogClosed() {
             this.$refs.addFormRef.resetFields()
         },
         addUser() {
             this.$refs.addFormRef.validate(async valid => {
                 if(!valid) return false
                 // 可以发起添加用户的网络请求
                 const {data : res} = await this.$http.post('roles',this.addForm)
                 if (res.meta.status !== 201) {
                     return this.$message.error('添加角色失败')
                 }
                 this.$message.success('添加角色成功')
                 this.addDialogVisible = false
                 // 刷新角色列表
                 this.getRolesList()
             })
         },
         // 修改用户
       async showEditDialog(id) {
          const { data: res } = await this.$http.get('roles/' + id)
          if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
          this.addForm = res.data
          this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
          this.$refs.addFormRef.resetFields()
      },
      // 提交修改的角色信息
      addUserInfo() {
          this.$refs.addFormRef.validate(async valid => {
              if (!valid) return false
              // 可以发起修改用户信息的数据请求
              const {data: res} = await this.$http.put(
                  `roles/${this.addForm.roleId}`,
                  {
                      roleName : this.addForm.roleName,
                      roleDesc : this.addForm.roleDesc
                  }
                  )
                  if (res.meta.status !== 200) {
                      return this.$message.error('更新用户信息失败')
                  }
                  // 关闭对话框
                  this.editDialogVisible = false
                  // 刷新用户列表
                  this.getRolesList()
                  // 提示修改成功
                  this.$message.success('更新用户信息成功')
              })
          },
        // 根据 ID 删除对应的角色
          async removeUserById(id) {
      // 询问框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户确认删除，则返回字符串 confirm，取消返回 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 确认了删除
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      if (document.querySelectorAll('.el-card tbody tr').length === 1) {
        this.queryInfo.pagenum = this.queryInfo.pagenum > 1 ? this.queryInfo.pagenum - 1 : 1
      }
      this.getRolesList()
    }
    
      }
    }

</script>


<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
    .vcenter {
      display: flex;
      align-items: center;
    }
</style>