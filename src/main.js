/**
 * Created by YYW on 2017/9/26.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes/routes'
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})
/* eslint-disable */
const app = new Vue({
  router
}).$mount('#app')
/* eslint-enable */
