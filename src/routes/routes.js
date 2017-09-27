/**
 * Created by YYW on 2017/9/26.
 */
// import App from '../App.vue'
export default [
  {
    path: '/',
    component: resolve => require(['../pages/Hello.vue'], resolve)
  },
  {
    path: '/dbTest',
    component: resolve => require(['../pages/dbTest.vue'], resolve)
  },
  {
    path: '/me',
    component: resolve => require(['../pages/me.vue'], resolve)
  }
]
