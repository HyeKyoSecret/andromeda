<template>
  <div class="discover">
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
        <span><img src="../../img/icon/gray-magnifier.png" /></span>
        <span><input type="text" placeholder="搜索" v-model="searchContent" @input="search"></span>
      </div>
      <div class="order" v-if="titleActive">
        <div class="inside-box">
          <div class="sort-reason" :class="{active: sortDefault}" @click="setSort('default')">默认排序</div>
          <div class="sort-reason" :class="{active: sortTime}" @click="setSort('time')">按时间排序</div>
          <div class="sort-reason" :class="{active: sortSub}" @click="setSort('sub')">按订阅数排序</div>
        </div>
      </div>
    </div>
    <div class="search-result" :class="{contentActive: contentActive, titleActive: titleActive, authorActive: authorActive}">
      <div class="one-search" v-if="contentActive || titleActive" v-for="item in result" @click="goStory(item.id)">
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
            <div class="story-content" v-html="item.content" :class="{contentClose: item.notShow}" :id="item.id"></div>
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
          <div class="one-friend" v-for="item in result" @click="goPeople(item.id)">
            <div class="head"><img :src="item.head"/></div>
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
        sortSub: false
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
      goStory (id) {
        this.$router.push('/story/' + id)
      },
      goPeople (id) {
        this.$router.push('/people/' + id)
      },
      setSort (way) {
        //
      },
      search: debounce(function () {
        if (this.searchContent) {
          Axios.post('/story/search', {
            active: this.active,
            content: this.searchContent
          }).then(response => {
            this.result = response.data.result
            this.$nextTick(function () {
              for (let i = 0; i < this.result.length; i++) {
                // 预渲染
                let f = document.getElementById(this.result[i].id)
                this.result[i].lineCount = this.countLines(f)
                if (this.result[i].lineCount > 3) {
                  let minWords = this.result[i].content.length / this.result[i].lineCount  // 每行最少字数
                  let delLeft = this.result[i].content.split('<em>').join('')
                  let delRight = delLeft.split('</em>').join('')
                  let targetPosition = 0
                  for (let j = 0; j < this.result[i].content.length; j++) {
                    if (this.result[i].content[j] === '<' && this.result[i].content[j + 1] === 'e' && this.result[i].content[j + 2] === 'm' && this.result[i].content[j + 3] === '>') {
                      targetPosition = j
                      break
                    }
                  }
                  if (targetPosition < minWords * 3) {
                    // 恢复显示
                    this.result[i].notShow = true
                    this.$set(this.result, i, this.result[i])  // 向vue声明
                  } else {
                    let cutwords = Math.round(targetPosition - (this.result[i].lineCount - 3) * minWords)  // 需要剪裁的字数（html去em标签再计算）
                    this.result[i].content = this.result[i].content.split('').reverse().slice(0, delRight.length - cutwords).reverse().join('')  // 颠倒取值
                    // 恢复显示
                    this.result[i].notShow = true
                    this.$set(this.result, i, this.result[i])  // 向vue声明
                  }
                }
              }
            })
          })
        } else {
          this.result = []
        }
      }, 500),
      countLines (ele) {
        let styles = window.getComputedStyle(ele, null)
        let lh = parseInt(styles.lineHeight, 10)
        let h = parseInt(styles.height, 10)
        return Math.round(h / lh)
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .discover {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: $bg-gray;
    .top-search {
      width: 100%;
      position: fixed;
      top: 0;
      z-index: 999;
    }
    .search-result.contentActive, .search-result.authorActive {
      width: 100%;
      margin-top: 140px;
    }
    .search-result.titleActive {
      width: 100%;
      margin-top: 180px;
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
        &:last-child {
          margin-bottom: 100px;
        }
        .one-friend {
          background: white;
          display: flex;
          border-bottom: 1px solid $line-gray;
          height: 60px;
          width: 100%;
          align-items: center;
          .head {
            margin-right: 25px;
            img {
              margin-left: 25px;
              height: 35px;
              width: 35px;
            }
          }
          .name {
            color: $font-dark;
            font-size: 16px;
          }
          &:last-child {
            border: none;
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
          border: 2px solid $dark-red;
          line-height: 22px;
          opacity: 1;
        }
        .name {
          line-height: 26px;
        }
        .name.active {
          border: 2px solid $dark-blue;
          line-height: 22px;
          opacity: 1;
        }
        .content {
          line-height: 26px;
        }
        .content.active {
          border: 2px solid $dark-yellow;
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
            width: 48px;
            height: 26px;
            background: red;
            color: white;
            border-radius: 5px;
            box-sizing: border-box;
          }
          .author {
            background: $icon-red;
            opacity: 0.5;
          }
          .name {
            background: $icon-blue;
            opacity: 0.5;
          }
          .content {
            background: $icon-yellow;
            opacity: 0.55;
          }
        }
      }
    }
    .search-bar {
      background-color: white;
      border-top: 1px solid $line-gray;
      border-bottom:1px solid $line-gray;
      height: 40px;
      input {
        line-height: 25px;
        border: none;
        font-size: 15px;
        vertical-align: middle;
        margin-top: 6px;
        margin-left: 10px;
        outline:none;
        color: $font-dark;
        width: 83%;
      }
      img {
        height: 22px;
        width: 20px;
        vertical-align: middle;
        margin-top: 7px;
        margin-left: 12px;
      }
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
          flex: 3;
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
            /*display: -webkit-box;*/
            /*display: -moz-box;*/
            /*-webkit-box-orient: vertical;*/
            /*-webkit-line-clamp: 3;*/
            /*-moz-box-orient: vertical;*/
            /*-moz-line-clamp: 3;*/
            /*overflow: hidden;*/
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
        margin-top: 10px;
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
