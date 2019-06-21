<template>
  <div class="my-creation">
    <notice v-bind:title="title" class="notice-bar"></notice>
    <div class="button-bar">
      <div class="button">
        <div ><span class="root" :class="{active: myRootActive}" @click="myRoot">{{rtitle}}</span></div>
        <div ><span class="story" :class="{active: myStoryActive}" @click="myStory">{{stitle}}</span></div>
      </div>
    </div>
    <keep-alive>
      <creation :story="myRootActive ? root : story" :type='myRootActive' v-on:loadMore="fetchData" v-on:refresh="refresh" class="creation"></creation>
    </keep-alive>
    <keep-alive>
      <router-view v-on:refreshImg="refreshImage"></router-view>
    </keep-alive>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import creation from '../../components/me/creation/creation.vue'
  import notice from '../../components/notice/notice.vue'
  import Axios from 'axios'
  import { Toast, Indicator } from 'mint-ui'
  import moment from 'moment'
  export default {
    components: {
      FootMenu,
      notice,
      creation
    },
    data () {
      return {
        isUser: false,
        title: '我的创作',
        rtitle: '我发起的',
        stitle: '我参与的',
        story: [],
        root: [],
        myRootActive: true,
        myStoryActive: false
      }
    },
    created: function () {
      this.fetchData('root')
      this.fetchData('story')
    },
    beforeRouteLeave (to, from, next) {
      console.log(from.meta.savedPosition)
      console.log(document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)
      from.meta.savedPosition = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      next()
    },
    methods: {
      refresh (type) {
        this[type] = []
        this.fetchData(type)
      },
      loadTop () {
        this.$refs.loadmore.onTopLoaded()
      },
      fetchData (type) {
        if (this.$route.name === 'creation') {
          Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
          })
          Axios.get('/user/getMyCreation', {
            params: {
              type: type,
              val: parseInt(this[type].length / 6),
              user: this.$route.params.user
            },
            timeout: 10000
          }).then((response) => {
            Indicator.close()
            if (response.data.permit) {
              let exist = this[type].some(function (story) {
                return response.data.result[0] && response.data.result[0].root === story.name
              })
              if (!exist) {
                for (let i = 0; i < response.data.result.length; i++) {
                  this[type].push({
                    name: response.data.result[i].root,
                    num: response.data.result[i].count ? response.data.result[i].count : response.data.result[i].data.length,
                    latestDate: moment(response.data.result[i].timeStamp).format('YYYY年M月D日 HH:mm'),
                    isRoot: response.data.result[i].label,
                    path: this.getPath(response.data.result[i]),
                    cover: response.data.result[i].cover,
                    nodeCounts: response.data.result[i].nodeCounts,
                    zanCounts: response.data.result[i].zanCounts,
                    readCounts: response.data.result[i].readCounts
                  })
                }
              }
            } else {
              if (response.data.type === '404') {
                // 用户名错误
                this.$emit('error')
              } else {
                // 数据库错误
                Toast({
                  message: '发生错误，请稍后再试',
                  position: 'middle',
                  duration: 1000
                })
              }
            }
          }).catch((error) => {
            Indicator.close()
            if (error) {
              Toast({
                message: '请求超时',
                position: 'middle',
                duration: 1000
              })
            }
          })
          Axios.get('/register/checkUser', {
            params: {
              user: this.$route.params.user
            }
          }).then(response => {
            if (response.data.customer) {
              this.title = response.data.sex + '的创作'
              this.rtitle = response.data.sex + '发起的'
              this.stitle = response.data.sex + '参与的'
            }
          })
        }
      },
      getPath (val) {
        return `myCreation/${val.root}`
      },
      setErrorImg (x) {
        this.story[x].cover = require('../../img/photo/default2.png')
      },
      myRoot () {
        this.myRootActive = true
        this.myStoryActive = false
      },
      myStory () {
        this.myRootActive = false
        this.myStoryActive = true
      },
      refreshImage (name, path) {
        // 同步修改封面
        for (let i = 0; i < this.root.length; i++) {
          if (this.root[i].name === name) {
            this.root[i].cover = path
            break
          }
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .my-creation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background: $bg-gray;
    .notice-bar {
      position: fixed;
      top: 0;
      width: 100%;
    }
    .button-bar {
      position: fixed;
      top: 42px;
      width: 100%;
      background: white;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .button {
        width: 90%;
        height: 26px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          flex: 1;
          text-align: center;
          line-height: 26px;
          span {
            display: inline-block;
            width: 80px;
            height: 40px;
            color: $font-gray;
            line-height: 40px;
            box-sizing: border-box;
          }
          .root.active {
            color: $font-dark;
            border-bottom: 2px solid $font-dark;
          }
          .story.active {
            color: $font-dark;
            border-bottom: 2px solid $font-dark;

          }
        }
      }
    }
    @media (min-width: 768px) {
      .notice-bar, .button-bar {
        max-width: 700px;
        .foot-menu {
          max-width: 700px;
        }
      }
    }
    .creation {
      margin-top: 90px;
    }
  }
  .mint-indicator {
    z-index: 999;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
