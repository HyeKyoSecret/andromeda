<template>
  <div class="discover">
    <notice title='发现'></notice>
    <div class="button-bar">
      <div class="button">
        <div>
          <span class="default">默认</span>
        </div>
        <div>
          <span class="subscribe">关注</span>
        </div>
        <div>
          <span class="friend">好友</span>
        </div>
        <div>
          <span class="nova">新星</span>
        </div>
      </div>
    </div>
    <div>
      <router-link tag="div" v-for="(item, index) in storyList" :to="item.path" :key='item.path' class="one-recommendation" >
        <div class="story-information">
          <div class="cover">
            <div><img :src='item.cover' @error="setErrorImg(index)"/></div>
            <div class="book-number">
              <span><img src="../../img/icon/graybook.png" /></span>
              <span class="number">4399</span>
            </div>
          </div>
          <div class="right-part">
            <div class="story-name">{{item.storyName}}</div>
            <div class="story-content">{{item.content}}</div>
          </div>
        </div>
        <div class="assist-info">
          <div class="reason">
            推送理由：来自好友2B
          </div>
          <div class="author-info">
            <div class="author-name">作者：{{item.author}}</div>
            <div class="time">{{item.date}}</div>
          </div>
        </div>
      </router-link>
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import notice from '../../components/notice/notice.vue'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    components: {
      FootMenu,
      notice
    },
    data () {
      return {
        storyList: []
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData () {
        Axios.get('/story/getDefaultDiscovery')
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              response.data.result.forEach((o) => {
                this.storyList.push({
                  storyName: o.storyName,
                  content: o.content,
                  author: o.author,
                  date: o.date,
                  path: `/story/${o.path}`,
                  cover: o.cover
                })
              })
            }
          })
      },
      setErrorImg (x) {
        this.storyList[x].cover = require('../../img/photo/defaultPic.png')
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
    box-sizing: border-box;
    background: $bg-gray;
    .notice {
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        text-align: center;
        font-size: 16px;
      }
      .icon {
        position: absolute;
        left: 8px;
        display: inline-block;
        height: 42px;
        width: 30px;
        line-height: 50px;
        img {
          width: 12px;
          height: 20px;
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
        .default {
          border: 2px solid $dark-green;
          line-height: 22px;
        }
        .subscribe {
          border: 2px solid $dark-red;
          line-height: 22px;
        }
        .friend {
          border: 2px solid $dark-blue;
          line-height: 22px;
        }
        .nova {
          border: 2px solid $dark-yellow;
          line-height: 22px;
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
          .default {
            background: $main-color;
          }
          .subscribe {
            background: $icon-red;
          }
          .friend {
            background: $icon-blue;
          }
          .nova {
            background: $icon-yellow;
          }
        }
      }
    }
    .one-recommendation {
      height: 145px;
      width: 100%;
      background-color: white;
      margin-top: 15px;
      &:last-child:after {
        content: '';
        display: block;
        height: 100px;
        width: 100%;
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
        .reason {
          color: $font-gray;
          font-size: 12px;
          flex:1;
          margin-top: 5px;
        }
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
