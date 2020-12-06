import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// import VueQuillEditor from 'vue-quill-editor'

// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// 导入axios
import axios from 'axios'
// 导入echars
import echarts from "echarts"
// 导入定时器
import './filters/date'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use((config) => {
  //展示进度条
  NProgress.start()
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
// 无效token的处理
axios.interceptors.response.use(res => {
  NProgress.done()
  // 当提示信息为无效的token或者状态为400
  if (res.data.meta.msg === '无效的token' && res.data.meta.status === 400) {
    // 跳转到登录页面
    localStorage.href = '/#/login'
  }
  return res
})
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

// 将富文本编辑器注册为全局可用的组件
Vue.use(window.VueQuillEditor)
// 将echars注册为全局可用的组件


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
