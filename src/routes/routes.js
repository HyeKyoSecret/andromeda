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
  },
  {
    path: '/change_info',
    component: resolve => require(['../pages/change_user_info.vue'], resolve)
  },
  {
    path: '/look_info',
    component: resolve => require(['../pages/look_info.vue'], resolve)
  },
  {
    path: '/register',
    component: resolve => require(['../pages/register.vue'], resolve)
  }
]
