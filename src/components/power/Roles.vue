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
                         <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                       </el-col>
                       <!-- 渲染二级和三级权限 -->
                       <el-col :span="19">
                         <!-- 通过for循环 嵌套渲染二级权限 -->
                         <el-row :class="[i2 === 0 ? '' : 'bdtop' ,'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                           <el-col :span="6">
                             <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                               <i class="el-icon-caret-right"></i>
                           </el-col>
                           <el-col :span="18">
                             <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
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
                    <el-button type="warning" icon="el-icon-setting" size="mini"  @click="showSetRightDialog(scope.row)">分配权限</el-button>
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
   <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
             // 控制分配权限框显示隐藏
           setRightDialogVisible : false,
           rightsList : [],
           // 树形控件的树形绑定对象
           treeProps : {
             label : 'authName',
             children : 'children'// 通过 children 树形实现父子节点的嵌套
           },
            // 默认选中的权限 ID，三级节点的 ID
          defKeys: [],
          // 当前角色 ID
          roleId: '',
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
    },
    // 根据ID删除对应的权限
     async removeRightById(role, rightId) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // 确认了删除
      // 角色ID、权限ID
      const {data : res} = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // 这样会发生完整渲染，导致收起
      // this.getRolesList()
      role.children = res.data
     },
     // 展示分配权限的对话框
     async showSetRightDialog(role) {
       // 存储角色ID
       this.roleId = role.id
       // 获取所有权限的数据
       const {data : res} = await this.$http.get('rights/tree')
       if (res.meta.status != 200) {
         return this.$message.error('获取权限数据失败')
       }
       this.rightsList = res.data
       // 递归存储三级节点的 ID
      this.getLeafKeys(role, this.defKeys)
       this.setRightDialogVisible =true
     },
      // 通过递归的形式，获取角色下所有三级权限的 ID，并保存到 defKeys 中
      getLeafKeys(node,arr) {
        if (!node.children) {
            // 没有 children 证明这儿就是三级节点
             return arr.push(node.id)
        }
         node.children.forEach(item => this.getLeafKeys(item, arr))
      },
       // 监听分配权限对话框的关闭事件
       setRightDialogClosed() {
         this.defKeys = []
       },
       // 点击为角色分配权限
       async allotRights() {
         const keys = [
           ...this.$refs.treeRef.getCheckedKeys(),
           ...this.$refs.treeRef.getHalfCheckedKeys()
         ]
         const idStr = keys.join()
         const {data : res} = await this.$http.post(`roles/${this.roleId}/rights`,{
           rids : idStr
         })
         if (res.meta.status !== 200) {
           return this.$message.error('分配权限失败')
         }
         this.$message.success('分配权限成功')
         // 重新渲染整个角色列表
         this.getRolesList()
         this.setRightDialogVisible = false
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