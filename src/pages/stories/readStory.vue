<template>
  <div class="read-story">
      <notice v-bind:title="storyInfo.title" v-bind:more="moreList"></notice>
      <div class="marker" @click="changeMark" v-if="markList !== 'notShow'">
        <img src="../../img/icon/marker_unselected.png" v-if="!markActive"/>
        <img src="../../img/icon/marker_selected.png" v-else/>
      </div>
      <v-touch v-on:swipeup="swipeUp" v-on:swipedown="swipeDown" v-on:swipeleft="swipeLeft" v-on:swiperight="swipeRight">
        <div class="context" @click.self="closeMenu"><p v-for="item in storyInfo.content">{{item}}</p></div>
        <div class="related-info">
          <div class="author-info">
            <div class="like">
              <router-link :to='storyInfo.authorId' tag="span">作者:&nbsp;{{storyInfo.author}}</router-link>
              <span v-if="showFocus">
          <img src="../../img/icon/redheart.png" v-if="hasFocus"/>
          <img src="../../img/icon/zan.png" v-else>
        </span>
              <span v-else class="blank"></span>
            </div>
            <div class="time">{{storyInfo.date}}</div>
          </div>
        </div>
      </v-touch>
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
        <div class="button" @click="openComment">
          <img src="../../img/icon/yellowcomment.png" />
          <div>评论</div>
        </div>
        <div class="button" @click="showButton">
          <img src="../../img/icon/yellowjump.png" />
          <div>前往</div>
        </div>
      </div>
      <div class="jump-menu" v-if="menuActive">
        <div class="button" v-if="jumpMenuRootCheck" @click="goStory(markRoot)">开头</div>
        <div class="button" @click="showMarkMenu">书签</div>
      </div>
      <div class="complete"  v-bind:style="{marginTop: markMenuMargin + 'px'}" v-if="markList.story && markList.story.length && markMenu"><span @click="closeMarkMenu">取消</span></div>
      <div class="mark-menu"  v-bind:style="{marginTop: markMenuMargin + 'px'}" v-if="markList.story && markList.story.length && markMenu">
        <mt-cell-swipe
          class="rq-mark"
          v-for="(item, index) in markList.story" :key="item.id"
          :right="[
              {
                content: '修改',
                style: { background: '#96D28E', color: '#fff', lineHeight: '56px' },
                handler:  function () {
            return changeMarkInfo(item.id)
          }
              }]">
          <slot>
            <div class="mt-name" @click="goStory(item.id)">{{item.name}}</div>
            <div class="mt-content" @click="goStory(item.id)">{{item.brief}}</div>
            <div class="mt-time" @click="goStory(item.id)">{{item.date}}</div>
          </slot>
        </mt-cell-swipe>
      </div>
      <div class="arrow">
        <div class="left-arrow">
          <img src="../../img/icon/left_arrow.png" alt="" v-if="leftNode">
        </div>
        <div class="right-arrow">
          <img src="../../img/icon/right_arrow.png" alt="" v-if="rightNode">
        </div>
      </div>
      <writeStory v-show="writeWindow" v-on:close="closeWrite" v-bind:ftNode="ftNode" v-bind:title="storyInfo.title"></writeStory>
      <router-view></router-view>
    </div>
</template>
<style lang='scss'>
  @import "../../scss/config";
  .rq-mark {
    text-align: left;
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 20px;
    height: 60px;
    border-top: 1px solid $border-gray;
    color: $font-dark;
    &:first-child {
      margin-top: 30px;
    }
    .mint-cell-title {
      width: 0;
      flex: 0;
    }
    .mint-cell-value {
      width: 98%;
      height: 60px;
      display: block;
      .mt-name {
        font-size: 15px;
        color: $font-dark;
        font-weight: 600;
        margin-top: 3px;
      }
      .mt-content {
        color: $font-dark;
        font-size: 14px;
        line-height: 19px;
        margin-top: 3px;
        display: -webkit-box;
        display: -moz-box;
         -webkit-box-orient: vertical;
         -webkit-line-clamp: 1;
         -moz-box-orient: vertical;
         -moz-line-clamp: 1;
        overflow: hidden;
      }
      .mt-time {
        margin-top: 5px;
        font-size: 12px;
        color: $font-color;
      }
    }

    &:nth-child(1){
      margin-top: 30px;
    }
  }
  .read-story {
    min-height: calc(100vh - 42px);
    margin-top: 42px;
    background: $bg-gray;
    .marker {
      position: absolute;
      top: 27px;
      right: 45px;
      z-index: 900;
      img {
        height: 45px;
        width: 25px;
      }
    }
    .context {
      margin: 30px 10px 0 11px;
      padding: 25px 0 0 5px;
      font-size: 16px;
      height: calc(100vh - 220px);
      color: $font-dark;
      white-space: pre-wrap;
      p {
        /*!*text-indent: 2em;*! 首行缩进*/
        margin: 5px 0 5px 0;
      }
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
          .blank {
            width: 10px;
            height: 20px;
            display: inline-block;
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
      position: absolute;
      top: 35%;
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
    .mark-menu {
      position: absolute;
      top: 136px;
      left: 50%;
      width: 260px;
      background-color: white;
      margin-left: -130px;
      border-radius: 8px;
      color: $font-dark;
      border: 1px solid $border-gray;
      max-height: 328px;
      overflow: auto;
      moz-user-select: -moz-none;
       -moz-user-select: none;
       -o-user-select: none;
       -khtml-user-select: none;
       -webkit-user-select: none;
       -ms-user-select: none;
      user-select: none;
    }
    .complete {
      position: absolute;
      z-index: 50;
      top: 137px;
      left: 50%;
      width: 259px;
      margin-left: -129px;
      color: $main-color;
      font-size: 14px;
      height: 28px;
      text-align: right;
      background: white;
      border-radius: 8px;
      margin-top: 1px solid $border-gray;
      span {
        width: 30px;
        display: inline-block;
        margin: 3px 8px 3px 0;
      }
    }
    .arrow {
      position: absolute;
      bottom: 60px;
      margin: 0 10px 0 10px;
      display: flex;
      width: calc(100vw - 20px);
      img {
        width: 20px;
      }
      div {
        flex: 1;
      }
      .left-arrow {
        text-align: left;
      }
      .right-arrow {
        text-align: right;
      }
    }
  }
  </style>
<script>
  import Axios from 'axios'
  import notice from '../../components/notice/notice.vue'
  import moment from 'moment'
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
          content: [],
          author: '',
          authorId: '',
          date: '',
          ftNode: ''
        },
        hasFocus: false, // 关注红星,
        showFocus: false,
        markRoot: '',
        markList: {},
        markMenu: false,
        menuActive: false,
        markActive: false,
        menuInfo: {
          zan: false,
          num: 0,
          subscribe: false
        },
        writeWindow: false,
        moreList: ['report'],
        downList: [],  // 下层候选节点
        frontNode: null,
        leftNode: null,
        rightNode: null
      }
    },
    created: function () {
      this.getData()
      this.getMark() // 获取书签
      this.ftNode = this.$route.params.id
      this.fetchMenuData()
      this.getDownNode()
      this.getFrontNode()
      this.addHistory()
      this.addDepth()
    },
    watch: {
      '$route' (to, from) {
        this.getData()
        this.getMark() // 获取书签
        this.ftNode = this.$route.params.id
        this.fetchMenuData()
        this.getDownNode()
        this.getFrontNode()
        this.addHistory()
        this.addDepth()
      }
    },
    computed: {
      markMenuMargin: function () {
        if (this.markList && this.markList.story) {
          return (5 - this.markList.story.length) * 25
        } else {
          return 0
        }
      },
      jumpMenuRootCheck: function () {
        const rootReg = /^R([0-9]){7}$/
        return !rootReg.test(this.$route.params.id)
      }
    },
    methods: {
      swipeUp () {
        if (this.downList.length > 0) {
          this.$router.replace(`/story/${this.downList[0].id}`)
        } else {
          Toast({
            message: '后面没有啦',
            position: 'middle',
            duration: 800
          })
        }
      },
      swipeDown () {
        if (this.frontNode) {
          this.$router.replace(`/story/${this.frontNode}`)
        } else {
          Toast({
            message: '上面没有啦',
            position: 'middle',
            duration: 800
          })
        }
      },
      swipeLeft () {
        if (this.rightNode) {
          this.$router.replace(`/story/${this.rightNode}`)
        } else {
          Toast({
            message: '右边没有啦',
            position: 'middle',
            duration: 800
          })
        }
      },
      swipeRight () {
        if (this.leftNode) {
          this.$router.replace(`/story/${this.leftNode}`)
        } else {
          Toast({
            message: '左边没有啦',
            position: 'middle',
            duration: 1000
          })
        }
      },
      getFrontNode () {          // 获取上、左、右结点
        this.leftNode = null
        this.rightNode = null
        Axios.get('/story/getFrontNode', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          this.frontNode = response.data.result
          if (this.frontNode) {
            Axios.get('/story/prepareTraversal', {
              params: {
                id: this.frontNode
              }
            }).then(response => {
              if (!response.data.error) {
                let frontDownList = response.data.result
                for (let i = 0; i < frontDownList.length; i++) {
                  if (frontDownList[i].id === this.$route.params.id) {
                    if (i > 0) {
                      this.leftNode = frontDownList[i - 1].id
                    }
                    if (i + 1 < frontDownList.length) {
                      this.rightNode = frontDownList[i + 1].id
                    }
                  }
                }
              } else {
                Toast({
                  message: '发生错误',
                  position: 'middle',
                  duration: 1000
                })
              }
            }).catch(err => {
              if (err) {
                Toast({
                  message: '发生错误',
                  position: 'middle',
                  duration: 1000
                })
              }
            })
          } else {
            this.leftNode = null
            this.rightNode = null
          }
        })
      },
      getDownNode () {
        Axios.get('/story/prepareTraversal', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          if (!response.data.error) {
            this.downList = response.data.result
          } else {
            Toast({
              message: '发生错误',
              position: 'middle',
              duration: 1000
            })
          }
        }).catch(err => {
          if (err) {
            Toast({
              message: '发生错误',
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
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
            this.storyInfo.content = response.data.result.content.split('\r\n')
            this.storyInfo.author = response.data.result.author
            this.storyInfo.authorId = `/people/${response.data.result.authorId}`
            this.storyInfo.date = response.data.result.date
            this.hasFocus = response.data.result.hasFocus
            this.showFocus = response.data.result.showFocus
          } else {
            this.$emit('error')
          }
        })
      },
      getMark () {
        Axios.get('/user/getMark', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          if (!response.data.error) {
            this.markList = response.data.result
            this.markRoot = response.data.root
            if (this.markList.story) {
              this.markList.story.reverse()
              for (let i = 0; i < this.markList.story.length; i++) {
                this.markList.story[i].date = moment(this.markList.story[i].date).format('YYYY年MM月DD日 HH:mm')
              }
            }
            this.markActive = response.data.mark
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
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
                message: '发生错误，请稍后再试',
                position: 'middle',
                duration: 1000
              })
            }
          } else {
            Toast({
              message: '发生错误，请稍后再试',
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
      changeMark () {
        this.markActive = !this.markActive
        Axios.post('/user/changeMark', {
          id: this.$route.params.id,
          markActive: this.markActive
        }).then(response => {
          this.getMark()
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      showButton () {
        this.menuActive = !this.menuActive
      },
      closeMenu () {
        this.menuActive = false
      },
      showMarkMenu () {
        if (!this.markList.story || this.markList.story.length === 0) {
          Toast({
            message: '无可用书签',
            position: 'middle',
            duration: 1000
          })
        }
        this.menuActive = false
        this.markMenu = true
      },
      closeMarkMenu () {
        this.markMenu = false
        this.menuActive = false
      },
      goStory (id) {
        this.markMenu = false
        this.menuActive = false
        this.$router.push('/story/' + id)
      },
      changeMarkInfo (id) {
        MessageBox.prompt('请输入新的书签名', '').then(({ value, action }) => {
          if (action === 'confirm') {
            Axios.post('/user/changeMarkInfo', {
              id: id,
              value: value
            }).then(response => {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
              this.getMark()
            })
          }
        }).catch(error => {
          return error
        })
      },
      openComment () {
        this.$router.push(this.$route.path + '/comment')
      },
      addHistory () {
        Axios.post('/history/addHistory', {
          id: this.$route.params.id
        }).then(response => {
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      addDepth () {
        Axios.post('/user/addDepth', {
          id: this.$route.params.id
        }).then(response => {
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      }
    }
  }

</script>

