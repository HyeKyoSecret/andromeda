<template>
  <mt-loadmore :top-method="loadTop" ref="loadmore"
       v-infinite-scroll="getData"
       infinite-scroll-disabled=false
       infinite-scroll-distance="10"
       infinite-scroll-immediate-check=true
       class="focus" id="focus" :style="{'height': (scroll - 82) + 'px'}">
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
    name: 'focus',
    created: function () {
      this.getData()
    },
    data () {
      return {
        storyList: [],
        loading: true,  // 用来设置infinite-scroll-disabled但暂时并没有用上
        scroll: window.innerHeight
      }
    },
    mounted () {
      window.addEventListener('resize', this.getHeight)
    },
    activated () {
      if (this.$route.meta.savedPosition > 0 && document.getElementById('focus')) {
        document.getElementById('focus').scrollTop = this.$route.meta.savedPosition
      }
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    },
    beforeRouteLeave (to, from, next) {
      from.meta.savedPosition = document.getElementById('focus') ? document.getElementById('focus').scrollTop : 0
      next()
    },
    methods: {
      getData () {
        Axios.get('/story/getFocusDiscovery', {
          params: {
            storyLength: parseInt(this.storyList.length / 6)
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
      loadTop () {
        this.storyList = []
        this.getData()
        this.$refs.loadmore.onTopLoaded()
      },
      setErrorImg (x) {
        this.storyList[x].cover = require('../../img/photo/defaultPic.png')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../scss/config";
  .focus {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .one-recommendation {
    height: 145px;
    width: 100%;
    background-color: white;
    margin-bottom: 10px;
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
        @-moz-document url-prefix(){
          .story-content{
            position: relative;
            line-height: 20px;
            max-height: 60px;
            overflow: hidden;
          }
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
