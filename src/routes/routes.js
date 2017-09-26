/**
 * Created by YYW on 2017/9/26.
 */
export default [
  {
    path: '/',
    component: resolve => require(['../pages/Hello.vue'], resolve)
  },
  {
    path: '/dbTest',
    component: resolve => require(['../pages/dbTest.vue'], resolve)
  }
]
