// /**
//  * Created by YYW on 2017/9/26.
//  */
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes/routes'
import App from './App.vue'
import MintUI from 'mint-ui'
import Axios from 'axios'
import VueScrollLock from 'vue-scroll-lock'
import VueFinger from './js/vueFinger'
import Vuex from 'vuex'
const VueTouch = require('vue-touch')
import store from './store'
Vue.use(VueTouch, {name: 'v-touch'})
if (process.env.NODE_ENV !== 'production') {
  Axios.defaults.baseURL = 'http://localhost:8080/api'
}
Vue.use(VueScrollLock)
Vue.use(Vuex)
Axios.defaults.withCredentials = true
const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (to.meta.savedPosition && to.meta.keepAlive) {
      setTimeout(() => {
        window.scrollTo(0, to.meta.savedPosition)
      }, 100)
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (from.name === 'login') {
      window.location.reload()
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
    } else {
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
      next()
    }
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
Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(VueFinger)
Vue.use(VueScrollLock)
/* eslint-disable */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  store,
  components: { App }
}).$mount('#app')
