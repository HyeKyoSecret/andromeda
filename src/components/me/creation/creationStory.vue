<template>
  <mt-loadmore :top-method="loadTop" class="my-creation-content" ref="loadmore"
               v-infinite-scroll="loadMore"
               infinite-scroll-disabled = false
               infinite-scroll-distance = "10" :style="{'height': (scroll - 82) + 'px'}"
               id="creationStory">
    <router-link :to="item.path" tag='div' class="one-story" v-for="(item, index) in story" :key="item.name">
      <div class="story-information">
        <div class="cover">
          <div><img :src="item.cover" @error="setErrorImg(index)"/></div>
          <div class="story-quantity">
            <span><img src="../../../img/icon/graybook.png" /></span>
            <span class="number">{{item.readCounts > 999 ? '999+' : item.readCounts}}人读过</span>
          </div>
          <div class="story-quantity">
            <span><img src="../../../img/icon/gray_flag.png" /></span>
            <span class="number">{{item.nodeCounts > 999 ? '999+' : item.readCounts}}篇后续</span>
          </div>
        </div>
        <div class="right-part">
          <div class="story-name">
            <span class="name">{{item.name}}</span>
            <span class="owner" v-if="item.isRoot">作者</span>
          </div>
          <div class="info-quantity">
            <span><img src="../../../img/icon/gray_pen.png" /></span>
            <span>{{item.num}}篇</span>
          </div>
          <div class="info-quantity zan">
            <span><img src="../../../img/icon/gray_thumb.png" /></span>
            <span>{{item.zanCounts}}次</span>
          </div>
          <div class="last-write-time">
            更新时间：{{item.latestDate}}
          </div>
        </div>
      </div>
    </router-link>
    <div class="blank"></div>
  </mt-loadmore>
</template>
<script>
  import Axios from 'axios'
  import { Toast, Indicator } from 'mint-ui'
  import moment from 'moment'
  export default {
    name: 'creationRoot',
    data () {
      return {
        scroll: window.innerHeight,
        position: 0,
        story: []
      }
    },
    mounted () {
      window.addEventListener('resize', this.getHeight)
    },
    created () {
      this.fetchData('story')
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    },
    beforeRouteLeave (to, from, next) {
      from.meta.savedPosition = document.getElementById('creationStory') ? document.getElementById('creationStory').scrollTop : 0
      next()
    },
    activated () {
      if (this.story.length > 0) {
        Axios.post('/user/checkCreationStory', {
          userId: this.$route.params.user,
          author: this.story[0].author
        }).then(response => {
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          } else {
            if (response.data.userCheck) {
              setTimeout(() => {
                if (this.$route.meta.savedPosition > 0 && document.getElementById('creationStory')) {
                  document.getElementById('creationStory').scrollTop = this.$route.meta.savedPosition
                }
              }, 100)
            } else {
              this.story = []
              this.fetchData('story')
            }
          }
        })
      }
    },
    methods: {
      fetchData (type) {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        Axios.get('/user/getMyCreation', {
          params: {
            val: parseInt(this[type].length / 6),
            user: this.$route.params.user,
            type: type
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
                this.story.push({
                  name: response.data.result[i].root,
                  num: response.data.result[i].count ? response.data.result[i].count : response.data.result[i].data.length,
                  latestDate: moment(response.data.result[i].timeStamp).format('YYYY年M月D日 HH:mm'),
                  isRoot: response.data.result[i].label,
                  path: this.getPath(response.data.result[i]),
                  cover: response.data.result[i].cover,
                  nodeCounts: response.data.result[i].nodeCounts,
                  zanCounts: response.data.result[i].zanCounts,
                  readCounts: response.data.result[i].readCounts,
                  author: response.data.result[i].author
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
            console.log(error)
            Toast({
              message: '请求超时',
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      getPath (val) {
        return `/people/${this.$route.params.user}/myCreation/${val.root}`
      },
      loadMore () {
        this.fetchData('story')
      },
      getHeight () {
        this.scroll = window.innerHeight
      },
      loadTop () {
        this.fetchData('story')
        this.$refs.loadmore.onTopLoaded()
      },
      setErrorImg (x) {
        this.story[x].cover = require('../../../img/photo/defaultPic.png')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../scss/config";
  .my-creation-content {
    position: absolute;
    top: 82px;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .one-story {
    height: 140px;
    width: 100%;
    background-color: white;
    margin-top: 8px;
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
        .story-quantity {
          height: 18px;
          img{
            height: 15px;
            width: 15px;
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
        margin-top: 8px;
        flex: 3.5;
        .story-name {
          color: $font-dark;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          .name {
            flex:5;
            text-align: left;
          }
          .owner {
            flex: 1;
            text-align: center;
            height: 20px;
            border:1px solid $icon-red;
            border-radius: 5px;
            font-size: 14px;
            color: $icon-red;
            font-weight: normal;
          }
        }
        .info-quantity {
          margin-top: 10px;
          font-size: 14px;
          color: $font-gray;
          img {
            width:18px;
            height:18px;
            vertical-align: center;
            margin-right: 5px;
          }
        }
        .last-write-time {
          margin-top: 20px;
          color: $font-gray;
          font-size: 14px;
        }
      }
    }
  }
  .blank {
    height: 100px;
    background: $bg-gray;
    width: 100%;
  }
</style>
