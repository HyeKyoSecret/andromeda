<template>
  <div class="read-story" :class="{bigFont: (settings.fontSize === '大'), superFont: (settings.fontSize === '特大')}">
      <notice v-bind:title="storyInfo.title" v-bind:more="moreList" v-bind:id="id" v-on:getMark="getMark" :mark="markActive" v-on:openFontSettings="openFont" v-on:openSearch="openSearch"></notice>
      <v-touch v-on:swipeup="swipeUp" v-on:swipedown="swipeDown" v-on:swipeleft="swipeLeft" v-on:swiperight="swipeRight">
        <div class="context"><p v-for="item in storyInfo.content">{{item}}</p></div>
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
        <div class="button" @click="openMark">
          <img src="../../img/icon/index.png" />
          <div>书签</div>
        </div>
      </div>
      <div class="arrow">
        <div class="left-arrow">
          <img src="../../img/icon/left_arrow.png" alt="" v-if="leftNode">
        </div>
        <div class="right-arrow">
          <img src="../../img/icon/right_arrow.png" alt="" v-if="rightNode">
        </div>
      </div>
      <div class="read-search" v-if="searchBoard">
        <div class="entry-triangle-top"></div>
        <div class="main-search">
          <div class="search-content">
            <div class="search-icon">
              <img src="../../img/icon/search_gray.png" alt="">
            </div>
            <div class="input">
              <form action="javascript:void(0)">
                <input type="text" placeholder="输入一段文字或作者名" v-model="smallSearch" @input="search">
              </form>
            </div>
          </div>
        </div>
        <div class="read-search-content">
          <div class="select-bar">
            <span class="words" :class="{active: contentActive}" @click="changeActive('content')">文本</span>
            <span class="author" :class="{active: authorActive}" @click="changeActive('author')">作者</span>
          </div>
          <div class="search-content">
            <scroll-lock :lock="true" :bodyLock="true" class="lock">
              <div class="one-search" v-for="item in readSearchResult" @click="goStory2(item.id)">
              <div class="search-id">{{item.id}}</div>
                <div class="search-words" v-html="item.highlight"></div>
              </div>
            </scroll-lock>
          </div>
        </div>
      </div>
      <writeStory v-show="writeWindow" v-on:close="closeWrite" v-bind:ftNode="ftNode" v-bind:title="storyInfo.title"></writeStory>
      <mt-radio ref="radio" v-on:refresh= 'getSettings' v-bind:id="id"></mt-radio>
      <div class="mask" v-if="searchBoard"></div>
    <router-view></router-view>
    </div>
</template>
<style lang='scss'>
  @import "../../scss/config";
  .mask {
    background: rgba(0,0,0,0.5);
    position: absolute;
    width: 100%;
    height: calc(100vh - 42px);
    margin-top: 42px;
    top: 0;
    left: 0;
    z-index: 990;
  }
  .read-search {
    .entry-triangle-top{
      position:absolute;
      z-index: 999;
      top: 42px;
      right:37px;
      width:0;
      height:0;
      border-width: 0 15px 15px;
      border-style: solid;
      border-color:transparent transparent white;/*透明 透明  灰*/
    }
    @media screen and (max-width: 370px) {
      .main-search {
        width: 240px;
        .search-content {
          width: 210px;
        }
      }
      .read-search-content {
        width: 240px;
        height: 300px;
        .search-content {
          height: 270px;
          overflow: hidden;
        }
      }
    }
    @media screen and (max-width: 500px) {
      .main-search {
        width: 275px;
        .search-content {
          width: 255px;
          input {
            width: 200px;
          }
        }
      }
      .read-search-content {
        width: 275px;
        height: 355px;
        .search-content {
          height: 325px;
          overflow: hidden;
        }
      }
    }
    @media screen and (min-width: 501px) {
      .main-search {
        width: 415px;
        .search-content {
          width: 385px;
          input {
            width: 335px;
          }
        }
      }
      .read-search-content {
        width: 415px;
        height: 505px;
        .search-content {
          height: 475px;
          overflow: hidden;
        }
      }
    }
    .main-search {
      height: 50px;
      background: white;
      position: absolute;
      top: 55px;
      right: 5px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
      .search-content {
        display: flex;
        border-radius: 10px;
        height: 38px;
        background: rgb(223, 223, 223);
        align-items: center;
        .search-icon {
          margin-left: 8px;
          margin-top: 4px;
          img {
            width: 22px;
          }
        }
        .input {
          height: 28px;
          margin-top: -4px;
          input {
            border: none;
            background: rgb(223, 223, 223);
            outline: none;
            height: 28px;
            padding-left: 5px;
            font-size: 14px;
          }
        }
      }
    }
   .read-search-content {
     position: absolute;
     z-index: 999;
     top: 99px;
     right: 5px;
     background: white;
     border-bottom-left-radius: 10px;
     border-bottom-right-radius: 10px;
     .search-content {
       .lock {
         width: 100%;
         overflow: scroll;
         height: 100%;
       }
     }
     .select-bar {
       height: 20px;
       margin-top: 10px;
       background: rgb(223, 223, 223);
       width: 100%;
       .words {
         color: $font-dark;
         font-size: 13px;
         display: inline-flex;
         margin-left: 10px;
         font-weight: 600;
       }
       .words.active {
         color: $font-dark;
         font-size: 13px;
         display: inline-flex;
         margin-left: 10px;
         font-weight: 600;
         border-bottom: 1px solid $font-dark;
       }
       .author {
         color: $font-dark;
         font-size: 13px;
         display: inline-flex;
         margin-left: 65px;
         font-weight: 600;
       }
       .author.active {
         color: $font-dark;
         font-size: 13px;
         display: inline-flex;
         margin-left: 65px;
         font-weight: 600;
         border-bottom: 1px solid $font-dark;
       }
     }
     .one-search {
       width: 92%;
       margin: 0 auto;
       padding: 5px;
       font-size: 12px;
       color: $font-dark;
       border-bottom: 1px solid $border-gray;
       .search-words {
         display: -webkit-box;
         display: -moz-box;
         -webkit-box-orient: vertical;
         -webkit-line-clamp: 3;
         -moz-box-orient: vertical;
         -moz-line-clamp: 3;
         overflow: hidden;
       }
       em {
         color: $main-red;
       }
     }
   }
  }
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
  .read-story.bigFont {
    .context {
      font-size: $b-font-7;
    }
    .author-info {
      .like span{
        font-size: $b-font-7;
      }
      .time {
        font-size: $b-font-3;
      }
    }
  }
  .read-story.superFont {
    .context {
      font-size: $s-font-9;
    }
    .author-info {
      .like span{
        font-size: $s-font-9;
      }
      .time {
        font-size: $b-font-5;
      }
    }
  }
  </style>
<script>
  import Axios from 'axios'
  import debounce from '../../js/debounce.js'
  import notice from '../../components/notice/notice.vue'
  import { Toast, MessageBox } from 'mint-ui'
  import writeStory from '../../components/story/writeStory.vue'
  import MtRadio from '../../components/me/settings/changeFontSize.vue'
  export default {
    components: {
      notice,
      writeStory,
      MtRadio
    },
    data () {
      return {
        settings: {}, // 设置
        id: this.$route.params.id,
        smallSearch: '',
        readSearchResult: [],    // 搜索内容
        storyInfo: {
          title: '',
          content: [],
          author: '',
          authorId: '',
          date: '',
          ftNode: ''
        },
        searchBoard: false,
        hasFocus: false, // 关注红星,
        showFocus: false,
        markActive: false,
        menuInfo: {
          zan: false,
          num: 0,
          subscribe: false
        },
        writeWindow: false,
        moreList: ['report', 'font', 'mark'],
        downList: [],  // 下层候选节点
        frontNode: null,
        leftNode: null,
        rightNode: null,
        contentActive: true,    // 文本搜索激活
        authorActive: false,
        active: 'content'
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
      this.getSettings()
    },
    watch: {
      '$route' (to, from) {
        this.id = this.$route.params.id
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
    methods: {
      onMaskTouchMove (e) {
        e.preventDefault()
        return false
      },
      changeActive (params) {
        if (params === 'content') {
          this.contentActive = true
          this.authorActive = false
          this.active = 'content'
          this.search()
        } else if (params === 'author') {
          this.contentActive = false
          this.authorActive = true
          this.active = 'author'
          this.search()
        }
      },
      search: debounce(function () {
        if (this.smallSearch.length > 0) {
          Axios.post('/story/readSearch', {
            id: this.$route.params.id,
            content: this.smallSearch,
            style: this.active
          }).then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 800
              })
            } else {
              this.readSearchResult = response.data.result
            }
          })
        }
      }, 500),
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
      getMark () {
        Axios.get('/user/getMark', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          if (!response.data.error) {
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
      goStory (id) {
        this.$router.push('/story/' + id)
      },
      goStory2 (id) {
        this.searchBoard = false
        this.smallSearch = ''
        this.readSearchResult = []
        this.$router.push('/story/' + id)
      },
      openComment () {
        this.$router.push(this.$route.path + '/comment')
      },
      openMark () {
        this.$router.push(this.$route.path + '/mark')
      },
      openSearch () {
        this.smallSearch = ''
        this.readSearchResult = []
        this.searchBoard = !this.searchBoard
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
      },
      getSettings () {
        Axios.get('/user/getSettings')
          .then(response => {
            if (!response.data.error) {
              this.settings = response.data.settings
            } else {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 800
              })
            }
          })
      },
      openFont () {
        this.$refs.radio.openRadio()
      }
    }
  }

</script>

