<template>
  <div>
     Home页面
    <el-button type="info" @click="logout"> 退出 </el-button>
  </div>
</template>

<script>
  export default {
    methods: {
      logout() {
        // 清空token
        window.sessionStorage.removeItem('token')
        // 跳转到登录页
        this.$router.push('/login');
      },
    },
  };
</script>

<style lang="less" scoped></style>