/**
 * Created by YYW on 2017/9/26.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes/routes'
import App from './App.vue'
import MintUI from 'mint-ui'
import Axios from 'axios'
import VueFinger from './js/vueFinger'
if (process.env.NODE_ENV !== 'production') {
  Axios.defaults.baseURL = 'http://localhost:8080/api'
}
Axios.defaults.withCredentials = true
Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(VueFinger)
const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    Axios.get('/register/checkLogin')    // 构建登录拦截
      .then((response) => {
        if (!response.data.login) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        } else {
          next()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else {       // 为不需要登录Auth的页面写入session
    // Axios.get('/checkLogin')
    //   .then((response) => {
    //      next()
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
    next() // 确保一定要调用 next()
  }
})
/* eslint-disable */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
}).$mount('#app')
/* eslint-enable */
