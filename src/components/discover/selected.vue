<template>
  <mt-loadmore :top-method="loadTop" ref= "loadmore" v-infinite-scroll="getData"
               infinite-scroll-disabled=loading
               infinite-scroll-distance="10"
               infinite-scroll-immediate-check=true
               class="selected"
               id="selected"
               :style="{'height': (scroll - 82) + 'px'}">
    <div v-for="(item, index) in storyList" :to="item.path" :key='item.path' @click="goStory(item.path)"
                 class="one-recommendation">
      <div class="story-information">
        <div class="cover">
          <div><img :src='item.cover' @error="setErrorImg(index)"/></div>
          <!--<div class="book-number">-->
          <!--<span><img src="../../img/icon/graybook.png" /></span>-->
          <!--<span class="number">4399</span>-->
          <!--</div>-->
        </div>
        <div class="right-part">
          <div class="story-name">{{item.storyName}}</div>
          <div class="story-content">{{item.content}}</div>
        </div>
      </div>
      <div class="assist-info">
        <!--<div class="reason">-->
        <!--</div>-->
        <div class="author-info">
          <div class="author-name">作者：{{item.author}}</div>
          <div class="time">{{item.date}}</div>
        </div>
      </div>
    </div>
    <div class="blank"></div>
  </mt-loadmore>
</template>
<script>
    import Axios from 'axios'
    import { Toast } from 'mint-ui'
    export default {
      name: 'selected',
      created: function () {
        this.getData()
      },
      activated () {
        if (this.$route.meta.savedPosition > 0 && document.getElementById('selected')) {
          document.getElementById('selected').scrollTop = this.$route.meta.savedPosition
        }
      },
      data () {
        return {
          storyList: [],
          loading: true,
          scroll: window.innerHeight
        }
      },
      mounted () {
        window.addEventListener('resize', this.getHeight)
      },
      destroyed () {
        window.removeEventListener('resize', this.getHeight)
      },
      beforeRouteLeave (to, from, next) {
        from.meta.savedPosition = document.getElementById('selected') ? document.getElementById('selected').scrollTop : 0
        next()
      },
      methods: {
        goStory (story) {
          Axios.get('/story/getLatestStory', {
            params: {
              id: story
            }
          }).then(response => {
            if (response.data.error) {
              Toast({
                position: 'middle',
                duration: 800,
                message: response.data.message
              })
            } else {
              this.$router.push(`/story/${response.data.id}`)
            }
          })
        },
        loadTop () {
          this.storyList = []
          this.getData()
          this.$refs.loadmore.onTopLoaded()
        },
        getHeight () {
          this.scroll = window.innerHeight
        },
        getData () {
          this.loading = true
          Axios.get('/story/getDefaultDiscovery', {
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
                  return story.path && response.data.result[0] && story.path[1].toString() === response.data.result[0].path.toString()
                })
                if (!existStory) {
                  response.data.result.forEach((o) => {
                    this.storyList.push({
                      storyName: o.storyName,
                      content: o.content,
                      author: o.author,
                      date: o.date,
                      path: o.path,
                      cover: o.cover
                    })
                  })
                }
              }
            })
          this.loading = false
        },
        setErrorImg (x) {
          this.storyList[x].cover = require('../../img/photo/defaultPic.png')
        }
      }
    }
</script>
<style lang="scss" scoped>
  @import "../../scss/config";
  .selected {
    margin-top: 40px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
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
