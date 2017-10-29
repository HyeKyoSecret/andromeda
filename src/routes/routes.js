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
    path: '/people/:user?',
    name: 'me',
    component: resolve => require(['../pages/me/me.vue'], resolve),
    children: [
      {
        path: 'message',
        component: resolve => require(['../pages/me/message.vue'], resolve),
        meta: { requiresAuth: true },
        children: [
          {
            path: 'words',
            name: 'message_words',
            component: resolve => require(['../components/me/message/words.vue'], resolve)
          },
          {
            path: 'promote',
            name: 'message_promote',
            component: resolve => require(['../components/me/message/promote.vue'], resolve)
          },
          {
            path: 'request',
            name: 'message_request',
            component: resolve => require(['../components/me/message/request.vue'], resolve)
          },
          {
            path: 'announcement',
            name: 'message_announcement',
            component: resolve => require(['../components/me/message/announcement.vue'], resolve)
          }
        ]
      },
      {
        path: 'myCreation',
        component: resolve => require(['../pages/stories/myCreation.vue'], resolve)
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
    path: '/buildStory',         // 创建新故事
    component: resolve => require(['../pages/stories/buildStory.vue'], resolve),
    meta: { requiresAuth: true }
  },
  {
    path: '/readStory',         // 阅读
    component: resolve => require(['../pages/stories/readStory.vue'], resolve)
  },
  {
    path: '/buildStoryRecommend',         // 阅读
    component: resolve => require(['../pages/stories/buildStoryRecommend.vue'], resolve)
  },
  {
    path: '/discover',
    component: resolve => require(['../pages/discover/discover.vue'], resolve)
  },
  {
    path: '/subscribe',
    component: resolve => require(['../pages/book/subscribe.vue'], resolve)
  },
  {
    path: '/start',
    component: resolve => require(['../pages/start/start.vue'], resolve)
  },
  {
    path: '/myCreationNode',
    component: resolve => require(['../pages/stories/myCreationNode.vue'], resolve)
  },
  {
    path: '/search',
    component: resolve => require(['../pages/search/search.vue'], resolve)
  },
  {
    path: '/marker',
    component: resolve => require(['../pages/stories/marker.vue'], resolve)
  },
  {
    path: '/error',
    component: resolve => require(['../pages/error.vue'], resolve)
  },
  {
    path: '*',
    component: resolve => require(['../pages/error.vue'], resolve)
  }
]
