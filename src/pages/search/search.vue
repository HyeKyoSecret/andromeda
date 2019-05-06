<template>
  <div class="search-main">
    <div class="top-search">
      <notice title="搜索"></notice>
      <div class="button-bar">
        <div class="button">
          <div>
            <span class="author" :class="{active: authorActive}" @click="changeActive('author')">作者</span>
          </div>
          <div>
            <span class="name" :class="{active: titleActive}" @click="changeActive('title')">题目</span>
          </div>
          <div>
            <span class="content" :class="{active: contentActive}" @click="changeActive('content')">内容</span>
          </div>
        </div>
      </div>
      <div class="search-bar">
        <span class="magnifier"><img src="../../img/icon/magnifier.png" /></span>
        <span class="search-input">
          <form action="javascript:void(0)">
            <input type="search" placeholder="搜索" @focus="startSearch" v-model="searchContent">
          </form>
        </span>
        <span class="delete" v-if="deleteBtn" @click="deleteSearch"><img src="../../img/icon/delete.png"></span>
        <span class="cancel" v-if="cancelBtn" @click="cancelSearch">取消</span>
      </div>
      <!--<div class="order" v-if="titleActive">-->
        <!--<div class="inside-box">-->
          <!--<div class="sort-reason" :class="{active: sortDefault}" @click="setSort('default')">默认排序</div>-->
          <!--<div class="sort-reason" :class="{active: sortTime}" @click="setSort('time')">按时间排序</div>-->
          <!--<div class="sort-reason" :class="{active: sortSub}" @click="setSort('sub')">按订阅数排序</div>-->
        <!--</div>-->
      <!--</div>-->
      <div class="search-history" v-if="searchHistory && searchHistoryList.length > 0">
        <div class="history-line" v-for="(item, index) in searchHistoryList">
          <span class="clock"><img src="../../img/icon/time.png" alt="" ></span>
          <span class="history-content" @click="setSearch(item.content, item.style)">{{item.content}}</span>
          <span class="delete" @click="deleteSearchHistory(item.content, item.style, index)"><img src="../../img/icon/delete.png"></span>
        </div>
        <div class="clear-history" @click="clearSearchHistory">清除浏览记录</div>
      </div>
    </div>
    <div class="search-result" :class="{contentActive: contentActive, titleActive: titleActive, authorActive: authorActive}">
      <div class="one-search" v-if="contentActive || titleActive" v-for="item in result" @click="goSearch(item.raw, active, item.id)">
        <div class="story-information">
          <div class="cover">
            <div><img :src="item.coverImg" /></div>
            <div class="book-number">
              <span><img src="../../img/icon/graybook.png" /></span>
              <span class="number">{{item.subNumber}}</span>
            </div>
          </div>
          <div class="right-part">
            <div class="story-name" v-html="item.name"></div>
            <div class="story-content" v-html="item.content" :id="item.id"></div>
          </div>
        </div>
        <div class="assist-info">
          <div class="author-info">
            <div class="author-name">作者: {{item.author}}</div>
            <div class="time">{{item.date}}</div>
          </div>
        </div>
      </div>
      <!--人-->
      <div class="search-board" v-if="authorActive">
        <div class="friend-list">
          <div class="one-friend" v-for="(item, index) in result" @click="goSearch(item.raw, active)">
            <div class="head"><img :src="item.head" @error="setErrorImg(index)"/></div>
            <div class="name" v-html="item.name"></div>
          </div>
        </div>
      </div>
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import notice from '../../components/notice/notice.vue'
  import Axios from 'axios'
  import debounce from '../../js/debounce.js'
  import { Toast, MessageBox, Indicator } from 'mint-ui'
  export default {
    components: {
      notice,
      FootMenu
    },
    data () {
      return {
        searchContent: '',
        active: 'author',
        authorActive: true,
        titleActive: false,
        contentActive: false,
        result: [],
        sortDefault: true,
        sortTime: false,
        sortSub: false,
        deleteBtn: false,  // 删除按钮
        cancelBtn: false, // 取消按钮
        searchHistory: false, // 历史菜单
        searchHistoryList: [] // 历史菜单列表
      }
    },
    beforeRouteEnter (to, from, next) {
      if (from.name === 'start') {
        next(vm => {
          vm.searchContent = ''
          vm.search()
        })
      } else {
        next()
      }
    },
    created: function () {
      this.getSearchHistory()
    },
    watch: {
      searchContent: function (val) {
        this.search()
        val.length > 0 ? this.deleteBtn = true : this.deleteBtn = false
        if (val.length === 0) {
          this.result = []
          this.getSearchHistory()
        }
        this.searchHistory = val.length === 0
      }
    },
    methods: {
      changeActive (param) {
        this.result = []
        this.active = param
        this.authorActive = false
        this.titleActive = false
        this.contentActive = false
        this[`${param}Active`] = true
        this.search()
      },
      getSearchHistory () {
        Axios.get('/user/getSearchHistory')
          .then(response => {
            if (!response.data.error) {
              this.searchHistoryList = response.data.history
            }
          })
      },
      deleteSearchHistory (content, style, index) {
        Axios.post('/user/deleteSearchHistory', {
          content: content,
          style: style
        }).then(response => {
          if (!response.data.error) {
            this.searchHistoryList = response.data.history
          } else {
            Toast({
              message: '发生错误，请稍后再试',
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      clearSearchHistory () {
        MessageBox.confirm('确实要清空记录吗?').then(action => {
          Axios.post('/user/clearSearchHistory')
            .then(response => {
              if (!response.data.error) {
                this.searchHistoryList = []
              } else {
                Toast({
                  message: '发生错误，请稍后再试',
                  position: 'middle',
                  duration: 1000
                })
              }
            })
        }).catch(cancel => {
          return true
        })
      },
      setSearch (content, active) {
        console.log(content, active)
        this.searchContent = content
        this.changeActive(active)
      },
      goSearch (content, active, id) {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        if (active === 'author') {
          Axios.post('/user/getSearchPeople', {
            content: content
          }, {timeout: 10000}).then(response => {
            if (response.data.error) {
              Indicator.close()
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              Indicator.close()
              Axios.post('/user/addSearchHistory', {
                content: content,
                active: active
              }).then(response => {
                return true
              })
              this.$router.push(response.data.path)
            }
          }).catch(err => {
            Indicator.close()
            if (err) {
              Toast({
                message: '发生错误',
                position: 'middle',
                duration: 1000
              })
            }
          })
        } else if (active === 'title') {
          Axios.post('/user/getSearchTitle', {
            content: content
          }).then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              Indicator.close()
              Axios.post('/user/addSearchHistory', {
                content: content,
                active: active
              }).then(response => {
                return true
              })
              this.$router.push(response.data.path)
            }
          })
        } else {
          Axios.post('/user/addSearchHistory', {
            content: this.searchContent,
            active: active,
            id: id
          }).then(response => {
            Indicator.close()
            return true
          })
          this.$router.push(`/story/${id}`)
        }
      },
      goPeople (id) {
        this.$router.push('/people/' + id)
      },
      setSort (way) {
        //
      },
      search: debounce(function () {
        if (this.searchContent) {
          Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
          })
          Axios.post('/story/search', {
            active: this.active,
            content: this.searchContent
          }).then(response => {
            Indicator.close()
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              this.result = response.data.result
            }
          }).catch(err => {
            Indicator.close()
            if (err) {
              Toast({
                message: '请求超时',
                position: 'middle',
                duration: 1000
              })
            }
          })
        } else {
          this.result = []
        }
      }, 400),
      countLines (ele) {
        let styles = window.getComputedStyle(ele, null)
        let lh = parseInt(styles.lineHeight, 10)
        let h = parseInt(styles.height, 10)
        return Math.round(h / lh)
      },
      cancelSearch () {
        this.deleteBtn = false
        this.cancelBtn = false
        this.searchHistory = false
        this.result = []
      },
      deleteSearch () {
        this.searchContent = ''
      },
      startSearch () {
        this.cancelBtn = true
        if (this.result.length === 0 && this.searchContent.length === 0) {
          this.searchHistory = true
        }
      },
      setErrorImg (index) {
        this.result[index].head = require('../../img/images/defaultHeadImg.png')
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .search-main {
    position: absolute;
    top: 0;
    left: 0;
    min-height: calc(100vh - 42px);
    margin-top: 42px;
    width: 100%;
    background: $bg-gray;
    @media (min-width: 768px) {
      .top-search {
        max-width: 700px;
        input {
          width: 82% !important;
        }
      }
    }
    .top-search {
      width: 100%;
      position: fixed;
      top: 42px;
      z-index: 999;
    }
    .search-result.contentActive, .search-result.authorActive {
      width: 100%;
      margin-top: 100px;
    }
    .search-result.titleActive {
      width: 100%;
      margin-top: 100px;
    }
    .search-board {
      width: 100%;
      min-height: calc(100vh - 250px);
      background: $bg-gray;
      i {
        color: red;
      }
      .friend-list {
        margin-top: 15px;
        .one-friend {
          background: white;
          border-bottom: 1px solid $line-gray;
          height: 44px;
          width: 100%;
          .head {
            display: inline-block;
            height: 44px;
            vertical-align: top;
            img {
              margin-left: 25px;
              margin-top: 10px;
              height: 26px;
              width: 26px;
            }
          }
          .name {
            display: inline-block;
            color: $font-dark;
            font-size: 16px;
            line-height: 44px;
            margin-left: 20px;
          }
          &:last-child {
            border: none;
          }
          &:last-child:after {
            display: block;
            content: '';
            height: 100px;
            width: 100%;
          }
        }
      }
    }

    .button-bar {
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
        justify-content: space-between;
        .author {
          line-height: 26px;
        }
        .author.active {
          color: $font-dark;
          border-bottom: 2px solid $font-dark;
          line-height: 22px;
          opacity: 1;
        }
        .name {
          line-height: 26px;
        }
        .name.active {
          color: $font-dark;
          border-bottom: 2px solid $font-dark;
          line-height: 22px;
          opacity: 1;
        }
        .content {
          line-height: 26px;
        }
        .content.active {
          color: $font-dark;
          border-bottom: 2px solid $font-dark;
          line-height: 22px;
          opacity: 1;
        }
        div {
          flex: 1;
          height: 26px;
          width: 30px;
          text-align: center;
          line-height: 26px;
          span {
            display: inline-block;
            width: 50px;
            height: 26px;
            color: $w-gray;
            box-sizing: border-box;
          }
        }
      }
    }
    .search-bar {
      background-color: white;
      height: 40px;
      display: flex;
      align-items: center;
      width: 100%;
      border-top: 1px solid $line-gray;
      border-bottom:1px solid $line-gray;
      .magnifier {
        flex: 1;
        margin-left: 10px;
        margin-right: 12px;
        img {
          height: 20px;
          width: 18px;
        }
      }
      .search-input {
        flex: 16;
      }
      .delete {
        flex: 1.4;
        vertical-align: bottom;
        img {
          height: 16px;
          width: 16px;
          vertical-align: bottom;
        }
      }
      .cancel {
        margin-right: 6px;
        letter-spacing: 1px;
        font-size: 13px;
        color: $w-gray;
        display: inline-block;
      }
      input{
        color: #333333;
        border: none;
        outline: none;
        padding-left: 5px;
        height: 35px;
        font-size: 14px;
        overflow: hidden;
        width: 100%;
      }
      input[type=search]::-webkit-search-cancel-button{
        -webkit-appearance: none;  //此处只是去掉默认的小×
      }
    }
    .search-history {
      width: 95%;
      margin: 8px auto 0 auto;
      background: white;
      .history-line {
        display: flex;
        height: 44px;
        border-bottom: 1px solid $line-gray;
        span {
          display: flex;
          align-items: center;
        }
        .clock {
          flex: 1;
          img {
            width: 22px;
            line-height: 44px;
            margin-left: 10px;
          }
        }
        .delete {
          flex: 1;
          img {
            width: 14px;
            text-align: center;
          }
        }
        .history-content {
          flex: 8;
          margin-right: 15px;
          text-align: left;
          margin-left: 10px;
          overflow: hidden;
          color: $font-dark;
        }
      }
    }
    .clear-history {
      height: 44px;
      color: $font-color;
      text-align: center;
      line-height: 44px;
    }
    .order {
      height:40px;
      background-color: white;
      .inside-box {
        display: flex;
        .sort-reason {
          flex: 1;
          margin-top: 10px;
          text-align: center;
          vertical-align: middle;
          height: 16px;
          line-height: 16px;
          border-right: 1px solid $line-gray;
          color: $font-gray;
          &:last-child {
            border:none;
          }
        }
        .sort-reason.active{
          color: $icon-yellow;
        }
      }
    }
    .one-search {
      min-height: 145px;
      width: 100%;
      background-color: white;
      margin-top: 10px;
      &:last-child {
        margin-bottom: 100px;
      }
      .story-information {
        margin-left: 10px;
        margin-right: 10px;
        height: 100px;
        display: flex;
        align-items:flex-start;
        .cover {
          margin-top: 10px;
          flex: 1;
          img {
            height: 88px;
            width: 66px;
          }
          .book-number {
            height: 18px;
            img{
              height: 15px;
              width: 15px;
              margin-left: 5px;
              vertical-align: text-bottom;
            }
            .number {
              margin-left: 3px;
              color: $font-gray;
              font-size: 12px;
            }
          }
        }
        .right-part {
          margin-left: 10px;
          margin-top: 8px;
          flex: 6;
          .story-name {
            color: $font-dark;
            font-size: 15px;
            font-weight: 600;
          }
          .story-content {
            margin-top: 3px;
            color: $font-dark;
            font-size: 14px;
            display: inline-block;
            line-height: 18px;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            -moz-box-orient: vertical;
            -moz-line-clamp: 3;
            overflow: hidden;
          }
          .story-content.contentClose {
            margin-top: 3px;
            color: $font-dark;
            font-size: 14px;
            display: inline-block;
            line-height: 18px;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            -moz-box-orient: vertical;
            -moz-line-clamp: 3;
            overflow: hidden;
          }
        }
      }
      .assist-info {
        display: flex;
        align-items: center;
        margin-left: 10px;
        margin-right: 10px;
        .author-info {
          text-align: right;
          flex: 1;
          font-size: 12px;
          color: $font-gray;
        }
      }
    }
  }
</style>
