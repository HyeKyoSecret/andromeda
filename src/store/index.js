import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  // 属性初始化
  state: {
    // 动态缓存需要的组件
    keepAlive: [] // 这里添加的是vue文件的name
  },
  // // 获取属性状态
  // getters: {
  //   // keepAlive: state => state.keepAlive
  // },
  // // 更改属性状态  同步
  mutations: {
    setKeepAlive: (state, keepAlive) => {
      state.keepAlive = keepAlive
    }
  },
  // 应用更改的属性状态 异步
  actions: {
  }
})
