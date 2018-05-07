<template>
  <div class="my-creation">
    <notice v-bind:title="title"></notice>
    <div class="button-bar">
      <div class="button">
        <div ><span class="root">我发起的</span></div>
        <div ><span class="story">我参与的</span></div>
      </div>
    </div>
      <div class="my-creation-content">
        <router-link :to="item.path" tag='div' class="one-story" v-for="(item, index) in story" :key="item.name">
          <div class="story-information">
            <div class="cover">
              <div><img :src="item.cover" @error="setErrorImg(index)"/></div>
              <div class="story-quantity">
                <span><img src="../../img/icon/graybook.png" /></span>
                <span class="number">4399</span>
              </div>
              <div class="story-quantity">
                <span><img src="../../img/icon/gray_flag.png" /></span>
                <span class="number">14392</span>
              </div>
            </div>
            <div class="right-part">
              <div class="story-name">
                <span class="name">{{item.name}}</span>
                <span class="owner" v-if="item.isRoot">题主</span>
              </div>
              <div class="info-quantity">
                <span><img src="../../img/icon/gray_pen.png" /></span>
                <span>{{item.num}}篇</span>
              </div>
              <div class="info-quantity">
                <span><img src="../../img/icon/gray_thumb.png" /></span>
                <span>122次</span>
              </div>
              <div class="last-write-time">
                最后创作时间：{{item.latestDate}}
              </div>
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
  import { Toast, Indicator } from 'mint-ui'
  import moment from 'moment'
  export default {
    components: {
      FootMenu,
      notice
    },
    data () {
      return {
        isUser: false,
        title: '我的创作',
        story: []
      }
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        Axios.get('/user/getMyCreation', {
          params: {
            user: this.$route.params.user
          },
          timeout: 8000
        }).then((response) => {
          Indicator.close()
          if (response.data.permit) {
            for (let i = 0; i < response.data.result.length; i++) {
              this.story.push({
                name: response.data.result[i].root,
                num: response.data.result[i].data.length,
                latestDate: moment(response.data.result[i].timeStamp).format('YYYY年M月D日'),
                isRoot: response.data.result[i].label,
                path: this.getPath(response.data.result[i]),
                data: response.data.data,
                cover: response.data.result[i].cover
              })
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
            Toast({
              message: '请求超时，请稍后再试',
              position: 'middle',
              duration: 1000
            })
          }
        })
        Axios.get('/register/checkUser', {
          params: {
            user: this.$route.params.user
          }
        }).then(response => {
          if (response.data.customer) {
            this.title = response.data.sex + '的创作'
          }
        })
      },
      getPath (val) {
        let path
        if (!val.label) {
          if (val.data.length === 1) {
            path = `/story/${val.data[0]}`
          } else {
            path = `myCreation/${val.root}`
          }
        } else {
          path = `myCreation/${val.root}`
        }
        return path
      },
      setErrorImg (x) {
        this.story[x].cover = require('../../img/photo/defaultPic.png')
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .my-creation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    /*height: 100%;*/
    min-height: 100%;
    background: $bg-gray;
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
        justify-content: center;
        .root.router-link-active {
          border: 2px solid $dark-red;
          line-height: 22px;
        }
        .story.router-link-active {
          border: 2px solid $dark-blue;
          line-height: 22px;
        }
        div {
          flex: 1;
          text-align: center;
          line-height: 26px;
          span {
            display: inline-block;
            width: 80px;
            height: 26px;
            color: white;
            border-radius: 5px;
            box-sizing: border-box;
          }
          .root{
            background: $icon-red;
          }
          .story {
            background: $icon-blue;
          }
        }
      }
    }
    .my-creation-content {
      margin-top: 25px;
    }
    .one-story {
      height: 140px;
      width: 100%;
      background-color: white;
      margin-bottom: 8px;
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
          .story-quantity {
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
          margin-top: 8px;
          flex: 3;
          .story-name {
            color: $font-dark;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            .name {
              flex:3;
              text-align: left;
            }
            .owner {
              margin-left: 50px;
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
              vertical-align: text-bottom;
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
  }
  .mint-indicator {
    z-index: 999;
  }
</style>
