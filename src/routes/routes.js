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
        component: resolve => require(['../pages/me/message.vue'], resolve),
        children: [
          {
            path: 'words',
            component: resolve => require(['../components/me/message/words.vue'], resolve)
          },
          {
            path: 'promote',
            component: resolve => require(['../components/me/message/promote.vue'], resolve)
          },
          {
            path: 'request',
            component: resolve => require(['../components/me/message/request.vue'], resolve)
          },
          {
            path: 'announcement',
            component: resolve => require(['../components/me/message/announcement.vue'], resolve)
          }
        ]
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
  },
  {
    path: '/test',
    component: resolve => require(['../pages/test.vue'], resolve)
  },
  {
    path: '*',
    component: resolve => require(['../pages/error.vue'], resolve)
  }
]
