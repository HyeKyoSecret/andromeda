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
const VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})
if (process.env.NODE_ENV !== 'production') {
  Axios.defaults.baseURL = 'http://localhost:8080/api'
}
Axios.defaults.withCredentials = true
Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(VueFinger)
Vue.use(VueScrollLock)
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
// /* eslint-disable */
//
// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Bar from './pages/test.vue'
// Vue.use(VueRouter)
//
// const Home = { template: '<div class="home">home</div>' }
// const Foo = { template: '<div class="foo">foo</div>' }
// // const Bar = {
// //   template: `
// //     <div class="bar">
// //       bar
// //       <div style="height:500px"></div>
// //       <p id="anchor" style="height:500px">Anchor</p>
// //       <p id="anchor2">Anchor2</p>
// //     </div>
// //   `
// // }
//
// // scrollBehavior:
// // - only available in html5 history mode
// // - defaults to no scroll behavior
// // - return false to prevent scroll
// const scrollBehavior = function (to, from, savedPosition) {
//   if (savedPosition) {
//     console.log(savedPosition)
//     // savedPosition is only available for popstate navigations.
//     return savedPosition
//   } else {
//     // const position = {}
//     // // scroll to anchor by returning the selector
//     // if (to.hash) {
//     //   position.selector = to.hash
//     //   // specify offset of the element
//       if (document.querySelector(to.hash)) {
//         return position
//       }
//     //   // if the returned position is falsy or an empty object,
//     //   // will retain current scroll position.
//     //   return false
//     // }
//   }
// }
//
// const router = new VueRouter({
//   mode: 'history',
//   base: __dirname,
//   scrollBehavior,
//   routes: [
//     { path: '/', component: Home, meta: { scrollToTop: true }},
//     { path: '/foo', component: Foo },
//     { path: '/bar', component: Bar, meta: { scrollToTop: true }}
//   ]
// })
//
// new Vue({
//   router,
//   template: `
//     <div id="app">
//       <h1>Scroll Behavior</h1>
//       <ul>
//         <li><router-link to="/">/</router-link></li>
//         <li><router-link to="/foo">/foo</router-link></li>
//         <li><router-link to="/bar">/bar</router-link></li>
//         <li><router-link to="/bar#abc">/bar#abc</router-link></li>
//         <li><router-link to="/bar#anchor2">/bar#anchor2</router-link></li>
//       </ul>
//         <router-view class="view"></router-view>
//     </div>
//   `
// }).$mount('#app')
// /* eslint-enable */
