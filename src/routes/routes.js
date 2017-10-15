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
    path: '/me/:username?',
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
    path: '/build_story',         // 创建新故事
    component: resolve => require(['../pages/stories/buildStory.vue'], resolve)
  },
  {
    path: '/build_story2',         // 创建新故事第二步
    component: resolve => require(['../pages/stories/buildStory2.vue'], resolve)
  },
  {
    path: '/build_story3',         // 创建新故事第三步
    component: resolve => require(['../pages/stories/buildStory3.vue'], resolve)
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
    path: '*',
    component: resolve => require(['../pages/error.vue'], resolve)
  }
]
