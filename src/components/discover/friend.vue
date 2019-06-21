<template>
  <mt-loadmore :top-method="loadTop" ref="loadmore" v-infinite-scroll="getData"
       infinite-scroll-disabled=false
       infinite-scroll-distance="10"
       infinite-scroll-immediate-check=true>
    <router-link tag="div" v-for="(item, index) in storyList" :to="item.path" :key='item.path'
                 class="one-recommendation">
      <div class="story-information">
        <div class="cover">
          <div><img :src='item.cover' @error="setErrorImg(index)"/></div>
        </div>
        <div class="right-part">
          <div class="story-name">{{item.storyName}}</div>
          <div class="story-content">{{item.content}}</div>
        </div>
      </div>
      <div class="assist-info">
        <div class="author-info">
          <div class="author-name">作者：{{item.author}}</div>
          <div class="time">{{item.date}}</div>
        </div>
      </div>
    </router-link>
    <div class="blank"></div>
  </mt-loadmore>
</template>
<script>
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    name: 'friend',
    created: function () {
      this.getData()
    },
    data () {
      return {
        storyList: []
      }
    },
    beforeRouteLeave (to, from, next) {
      console.log(from.meta.savedPosition)
      console.log(document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)
      from.meta.savedPosition = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      next()
    },
    methods: {
      loadTop () {
        this.storyList = []
        this.getData()
        this.$refs.loadmore.onTopLoaded()
      },
      getData () {
        Axios.get('/story/getFriendDiscovery', {
          params: {
            storyLength: parseInt(this.storyList.length / 8)
          }
        })
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              let existStory = this.storyList.some(function (story) {
                return story.path && response.data.result[0] && story.path.split('/story/')[1].toString() === response.data.result[0].path.toString()
              })
              if (!existStory) {
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
            }
          })
      },
      setErrorImg (x) {
        this.storyList[x].cover = require('../../img/photo/defaultPic.png')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../scss/config";
  .one-recommendation {
    height: 145px;
    width: 100%;
    background-color: white;
    margin-top: 10px;
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
          border-radius: 2px;
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
        margin-left: 12px;
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
      margin-top: 5px;
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
  .blank {
    height: 100px;
    background: $bg-gray;
    width: 100%;
  }
</style>
