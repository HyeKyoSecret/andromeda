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
    component: resolve => require(['../pages/me/me.vue'], resolve),
    children: [
      {
        path: 'message',
        component: resolve => require(['../pages/me/message.vue'], resolve)
      }
    ]
  },
  {
    path: '/change_info',
    component: resolve => require(['../pages/me/change_user_info.vue'], resolve)
  },
  {
    path: '/look_info',
    component: resolve => require(['../pages/me/look_info.vue'], resolve)
  },
  {
    path: '/register',
    component: resolve => require(['../pages/register/register.vue'], resolve)
  },
  {
    path: '/login',
    component: resolve => require(['../pages/register/login.vue'], resolve)
  }
]
