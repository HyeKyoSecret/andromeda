/**
 * Created by YYW on 2017/9/26.
 */
// import App from '../App.vue'
export default [
  {
    path: '/',
    name: 'home',
    redirect: to => {
      return '/discover/selected'
    },
    meta: {rank: 1}
  },
  {
    path: '/people/:user?/',
    name: 'people',
    component: resolve => require(['../pages/me/me.vue'], resolve),
    meta: {rank: 1.5, keepAlive: false},
    children: []
  },
  {
    path: '/people/:user/subscribe',
    name: 'subscribe',
    component: resolve => require(['../pages/me/subscribe.vue'], resolve),
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/people/:user/myCreation/:rootName',
    name: 'myCreation',
    alias: 'creationNode',
    component: resolve => require(['../pages/me/myCreationNode.vue'], resolve),
    meta: { requiresAuth: true, keepAlive: true, savedPosition: 0, compName: 'myCreation', rank: 2.5 }
  },
  {
    path: '/people/:user/changeInfo',
    name: 'changeInfo',
    component: resolve => require(['../pages/me/changeInfo.vue'], resolve),
    meta: { requiresAuth: true, keepAlive: false },
    beforeEnter: (to, from, next) => {
      if (from.name === 'login') {
        next({
          path: '/'
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/people/:user/history',
    name: 'history',
    component: resolve => require(['../pages/me/history.vue'], resolve),
    meta: { requiresAuth: true, keepAlive: true, savedPosition: 0 },
    beforeEnter: (to, from, next) => {
      if (from.name !== 'story') {
        to.meta.keepAlive = false
        next()
      } else {
        if (!to.meta.keepAlive) {
          to.meta.keepAlive = true
        }
        next()
      }
    }
  },
  {
    path: '/people/:user/settings',
    name: 'settings',
    component: resolve => require(['../pages/me/settings.vue'], resolve),
    meta: { requiresAuth: true }
  },
  {
    path: '/people/:user/friendList',
    name: 'friendList',
    component: resolve => require(['../pages/me/friendList.vue'], resolve),
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/people/:user/focusList',
    name: 'focusList',
    component: resolve => require(['../pages/me/focusList.vue'], resolve),
    meta: { requiresAuth: true, keepAlive: false }
  },
  {
    path: '/people/:user/message',
    name: 'message',
    component: resolve => require(['../pages/me/message.vue'], resolve),
    meta: { requiresAuth: true, keepAlive: false, rank: 2.5 },
    children: [
      {
        path: 'words',
        name: 'message_words',
        component: resolve => require(['../components/me/message/words.vue'], resolve)
      },
      {
        path: 'promote',
        name: 'message_promote',
        component: resolve => require(['../components/me/message/promote.vue'], resolve),
        children: [
          {
            path: 'fc',
            name: 'fc',
            component: resolve => require(['../components/me/message/fc.vue'], resolve),
            meta: { requiresAuth: true, compName: 'fc', rank: 3.5 }
          },
          {
            path: 'cm',
            name: 'cm',
            component: resolve => require(['../components/me/message/cm.vue'], resolve),
            meta: { requiresAuth: true, compName: 'cm', rank: 3.5 }
          },
          {
            path: 'sub',
            name: 'sub',
            component: resolve => require(['../components/me/message/sub.vue'], resolve),
            meta: { requiresAuth: true, keepAlive: true, savedPosition: 0, compName: 'sub', rank: 3.5 }
          },
          {
            path: 'subMessage/:id',
            name: 'rs',
            component: resolve => require(['../components/me/message/rs.vue'], resolve),
            meta: { requiresAuth: true, compName: 'rs', rank: 3.5 }
          }
        ]
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
    path: '/people/:user/creation',
    name: 'creation',
    component: resolve => require(['../pages/me/creation.vue'], resolve),
    meta: { rank: 2.5, requiresAuth: true, compName: 'creation' },
    children: [
      {
        path: 'root',
        name: 'creationRoot',
        component: resolve => require(['../components/me/creation/creationRoot.vue'], resolve),
        meta: { requiresAuth: true, keepAlive: true, savedPosition: 0, rank: 3.5 },
        beforeEnter: (to, from, next) => {
          if (from.name === 'people') {
            to.meta.savedPosition = 0
            next()
          } else {
            next()
          }
        }
      },
      {
        path: 'story',
        name: 'creationStory',
        component: resolve => require(['../components/me/creation/creationStory.vue'], resolve),
        meta: { requiresAuth: true, keepAlive: true, savedPosition: 0, rank: 3.5 },
        beforeEnter: (to, from, next) => {
          if (from.name === 'people') {
            to.meta.savedPosition = 0
            next()
          } else {
            next()
          }
        }
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: resolve => require(['../pages/register/register.vue'], resolve)
  },
  {
    path: '/addFriend',
    name: 'addFriend',
    component: resolve => require(['../pages/others/addFriend.vue'], resolve)
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['../pages/register/login.vue'], resolve)
  },
  {
    path: '/buildStory', // 创建新故事
    name: 'build',
    component: resolve => require(['../pages/stories/buildStory.vue'], resolve),
    meta: { requiresAuth: true }
  },
  {
    path: '/story/:id/', // 阅读
    name: 'story',
    component: resolve => require(['../pages/stories/readStory.vue'], resolve),
    children: [
      {
        path: 'comment/',
        name: 'storyComment',
        component: resolve => require(['../pages/stories/comment/comment.vue'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: 'mark',
        name: 'mark',
        component: resolve => require(['../pages/stories/mark/mark.vue'], resolve),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/comment/:id/',
    name: 'comment',
    component: resolve => require(['../pages/comment/comment.vue'], resolve)
  },
  {
    path: '/reply/:id/',
    name: 'reply',
    component: resolve => require(['../pages/comment/reply.vue'], resolve),
    meta: { requiresAuth: true }
  },
  {
    path: '/buildStoryRecommend',         // 阅读
    name: 'buildStoryRecommend',
    component: resolve => require(['../components/story/buildStoryRecommend.vue'], resolve)
  },
  {
    path: '/discover',
    name: 'discover',
    component: resolve => require(['../pages/discover/discover.vue'], resolve),
    meta: { keepAlive: true, rank: 1.5 },
    children: [
      {
        path: 'selected/',
        name: 'selected',
        component: resolve => require(['../components/discover/selected.vue'], resolve),
        meta: { savedPosition: 0, keepAlive: true, rank: 2.5 }
      },
      {
        path: 'focus/',
        name: 'focus',
        component: resolve => require(['../components/discover/focus.vue'], resolve),
        meta: { requiresAuth: true, savedPosition: 0, keepAlive: true }
      },
      {
        path: 'friend/',
        name: 'friend',
        component: resolve => require(['../components/discover/friend.vue'], resolve),
        meta: { requiresAuth: true, savedPosition: 0, keepAlive: true }
      }
    ]
  },
  {
    path: '/start',
    name: 'start',
    component: resolve => require(['../pages/start/start.vue'], resolve)
  },
  {
    path: '/search',
    name: 'search',
    component: resolve => require(['../pages/search/search.vue'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: '/writeStory',
    name: 'writeStory',
    component: resolve => require(['../components/story/writeStory.vue'], resolve)
  },
  {
    path: '/marker',
    name: 'marker',
    component: resolve => require(['../pages/stories/marker.vue'], resolve)
  },
  {
    path: '/dialogue/:id',
    name: 'dialogue',
    component: resolve => require(['../pages/dialogue/dialogue.vue'], resolve),
    meta: { requiresAuth: true }
  },
  {
    path: '/error',
    name: 'sError',
    component: resolve => require(['../components/error/errorPage.vue'], resolve)
  },
  {
    path: '*',
    name: 'error',
    component: resolve => require(['../components/error/errorPage.vue'], resolve)
  }
]
