/**
 * Created by YYW on 2017/9/26.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes/routes'
import App from './App.vue'
import MintUI from 'mint-ui'
import Axios from 'axios'
if (process.env.NODE_ENV !== 'production') {
  Axios.defaults.baseURL = 'http://localhost:8080/api'
}
Vue.use(MintUI)
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})
/* eslint-disable */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
}).$mount('#app')
/* eslint-enable */
