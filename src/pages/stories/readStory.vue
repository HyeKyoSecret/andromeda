<template>
  <div class="read-story">
    <notice v-bind:title="storyInfo.title"></notice>
    <div class="marker">
      <img src="../../img/icon/marker_selected.png" />
    </div>
    <div class="context">
      {{storyInfo.content}}
    </div>
    <div class="related-info">
      <!--<div class="anchor"><thumb src="../../thumb/icon/anchor.png" /></div>-->
      <div class="author-info">
        <div class="like">
          <router-link :to='storyInfo.authorId' tag="span">作者:&nbsp;{{storyInfo.author}}</router-link>
          <span ><img src="../../img/icon/redheart.png" /></span>
        </div>
        <div class="time">{{storyInfo.date}}</div>
        <!--<div class="follow-number">-->
          <!--<span class="tri"><thumb src="../../thumb/icon/triangle_downward.png"/></span>-->
          <!--<span class="number">1563</span>-->
        <!--</div>-->
      </div>
    </div>
    <div class="read-foot-menu">
      <div class="button" v-if='menuInfo.zan'>
        <img v-if='menuInfo.zan' src="../../img/icon/yellowthumb.png" @click="cancelZan"/>
        <div>{{menuInfo.num}}赞</div>
      </div>
      <div class="button" v-else>
        <img src="../../img/icon/yellowthumb_unselected.png"  @click="addZan"/>
        <div>{{menuInfo.num}}赞</div>
      </div>
      <div class="button" v-if='menuInfo.subscribe' @click="cancelSubscribe">
        <img src="../../img/icon/yellowstar.png" />
        <div>已订阅</div>
      </div>
      <div class="button" v-else @click="addSubscribe">
        <img src="../../img/icon/yellowstar_unselected.png" />
        <div>订阅</div>
      </div>
      <div class="write-continue">
        <div><img src="../../img/icon/writecontinue.png" @click="writeStory"/></div>
      </div>
      <div class="button">
        <img src="../../img/icon/yellowcomment.png" />
        <div>评论</div>
      </div>
      <div class="button">
        <img src="../../img/icon/yellowjump.png" />
        <div>智能跳转</div>
      </div>
    </div>
    <div class="jump-menu">
      <div class="button">刚才阅读</div>
      <div class="button">最浅未读</div>
      <div class="button">最深以读</div>
      <div class="button">开头</div>
      <div class="button">锚定节点</div>
      <div class="button">热门节点</div>
      <div class="button">书签</div>
    </div>
    <writeStory v-show="writeWindow" v-on:close="closeWrite" v-bind:ftNode="ftNode" v-bind:title="storyInfo.title"></writeStory>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
  .read-story {
    height: 100%;
    background: $bg-gray;
    .marker {
      float: right;
      margin-right: 30px;
      margin-top: -15px;
      img {
        height: 45px;
        width: 25px;
      }
    }
    .context {
      margin: 30px 10px 0 10px;
      font-size: 16px;
      height: calc(100vh - 300px);
      color: $font-dark;
    }
    .related-info {
      display: flex;
      margin-top: 5px;
      justify-content: space-between;
      .anchor {
        flex: 2;
        flex-grow: 0;
        margin-left: 5%;
        width: 100px;
        img {
          height: 50px;
          width: 50px;
        }
      }
      .author-info {
        flex: 1;
        text-align: right;
        margin-right: 15px;
        .like {
          span{
            img {
              height: 20px;
              width: 20px;
              margin-left: 5px;
              vertical-align: middle;
            }
            color: $font-gray;
            font-size: 16px;
            text-align: right;

          }
        }
        .time {
          font-size: 12px;
          color: $font-gray;
          margin-top: 5px;
          margin-right: 15px;
        }
        .follow-number {
          color: $font-gray;
          font-size: 15px;
          text-align: right;
          margin-top: 10px;
          margin-right: 20px;
          img {
            height: 15px;
            width: 15px;
            margin-right: 5px;
            vertical-align: middle;
          }
        }

      }
    }
    .read-foot-menu {
      width: 100%;
      height: 48px;
      background: white;
      position: absolute;
      bottom: 0;
      display: flex;
      color: $menu-color;
      .button {
        flex: 1;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        text-align: center;
        img {
          margin: 4px auto 0 auto;
          width: 23px;
          height: 23px;
        }
        font-size: 12px;
      }
      .write-continue {
        flex: 2;
        div {
          width: 86px;
          height: 43px;
          background: white;
          border-radius: 1000px 1000px 0 0 ;
          position: absolute;
          top: -24px;
          left: 50%;
          margin-left: -43px;
        }
        img {
          position: absolute;
          left: 50%;
          top: 8px;
          width: 61px;
          height: 52px;
          margin-left: -39px;
        }
      }
    }
    .jump-menu {
      display: none;
      position: absolute;
      top: 120px;
      left: 50%;
      width: 240px;
      background-color: white;
      margin-left: -120px;
      border-radius: 8px;
      color: $font-dark;
      border: 1px solid $border-gray;
      .button {
        text-align: center;
        font-size: 18px;
        height: 45px;
        line-height: 45px;

        border-bottom: 1px solid $line-gray;
        &:last-child {
          border:  none;
        }
      }

    }
  }
  </style>
<script>
  import Axios from 'axios'
  import notice from '../../components/notice/notice.vue'
  import { Toast, MessageBox } from 'mint-ui'
  import writeStory from '../../components/story/writeStory.vue'
  export default {
    components: {
      notice,
      writeStory
    },
    data () {
      return {
        storyInfo: {
          title: '',
          content: '',
          author: '',
          authorId: '',
          date: '',
          ftNode: ''
        },
        menuInfo: {
          zan: false,
          num: 0,
          subscribe: false
        },
        writeWindow: false
      }
    },
    created: function () {
      this.getData()
      this.ftNode = this.$route.params.id
      this.fetchMenuData()
//      this.getNextNode()
      this.prepareRec()
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      writeStory () {
        this.writeWindow = true
      },
      closeWrite () {
        this.writeWindow = false
      },
      getData () {
        Axios.get('/story/getStory', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          if (response.data.permit && response.data.result) {
            this.storyInfo.title = response.data.result.title
            this.storyInfo.content = response.data.result.content
            this.storyInfo.author = response.data.result.author
            this.storyInfo.authorId = `/people/${response.data.result.authorId}`
            this.storyInfo.date = response.data.result.date
          } else {
            this.$emit('error')
          }
        })
      },
      fetchMenuData () {
        Axios.get('/story/getMenuData', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          this.menuInfo.zan = response.data.result.zan
          this.menuInfo.num = response.data.result.num
        })
        Axios.get('/story/getSubscribe', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          if (response.data.login && response.data.success) {
            this.menuInfo.subscribe = response.data.result
          } else {
            this.menuInfo.subscribe = false
          }
        })
      },
      addZan () {
        // 查用户权限
        Axios.post('/story/addZan', {
          id: this.$route.params.id
        }).then(response => {
          if (response.data.login) {
            if (response.data.success) {
              this.fetchMenuData()
            } else {
              Toast({
                message: '发生错误请稍后再试',
                position: 'middle',
                duration: 1000
              })
            }
          } else {
            MessageBox({
              title: '您需要登录才可进行操作',
              message: '现在去登录吗?',
              showCancelButton: true
            }).then(action => {
              if (action === 'confirm') {
                this.$router.push('/login')
              }
              // 这边欠一个重定向
            })
          }
        })
      },
      cancelZan () {
        Axios.post('/story/cancelZan', {
          id: this.$route.params.id
        }).then(response => {
          if (response.data.login) {
            if (response.data.success) {
              this.fetchMenuData()
            } else {
              Toast({
                message: '发生错误请稍后再试',
                position: 'middle',
                duration: 1000
              })
            }
          } else {
            Toast({
              message: '发生错误请稍后再试',
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      addSubscribe () {
        Axios.post('/story/addSubscribe', {
          id: this.$route.params.id
        }).then(response => {
          if (response.data.login) {
            if (response.data.success) {
              this.fetchMenuData()
            } else {
              Toast({
                message: '发生错误请稍后再试',
                position: 'middle',
                duration: 1000
              })
            }
          } else {
            MessageBox({
              title: '您需要登录才可进行操作',
              message: '现在去登录吗?',
              showCancelButton: true
            }).then(action => {
              this.$router.push('/login')
              // 这边欠一个重定向
            })
          }
        })
      },
      cancelSubscribe () {
        Axios.post('/story/cancelSubscribe', {
          id: this.$route.params.id
        }).then(response => {
          if (response.data.login) {
            if (response.data.success) {
              this.fetchMenuData()
            } else {
              Toast({
                message: '发生错误请稍后再试',
                position: 'middle',
                duration: 1000
              })
            }
          } else {
            Toast({
              message: '发生错误请稍后再试',
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      prepareRec () {
        Axios.get('/story/prepareTraversal', {
          params: {
            id: this.$route.params.id
          }
        })
      }
//      getNextNode () {
//        Axios.get('/story/getNextNode', {
//          params: {
//            id: this.$route.params.id
//          }
//        }).then(response => {
//          console.log(response.data)
//        })
//      }
    }
  }
</script>
