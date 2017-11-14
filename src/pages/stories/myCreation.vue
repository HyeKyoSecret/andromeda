<template>
  <div class="my-creation">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        {{title}}
      </span>
    </div>
    <div class="create-new-story" v-if="isUser">
      撰写新的故事
    </div>
    <div>
      <router-link :to="item.path" tag='div' class="one-story" v-for="item in story">
        <div class="story-information">
          <div class="cover">
            <div><img src="../../img/photo/LegendofZelda.png" /></div>
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
              <span class="owner">题主</span>
            </div>
            <div class="info-quantity">
              <span><img src="../../img/icon/gray_pen.png" /></span>
              <span>3篇</span>
            </div>
            <div class="info-quantity">
              <span><img src="../../img/icon/gray_thumb.png" /></span>
              <span>122次</span>
            </div>
            <div class="last-write-time">
              最后创作时间：2017年6月12日
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
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    components: {
      FootMenu
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
        Axios.get('/user/getMyCreation', {
          params: {
            user: this.$route.params.user
          }
        }).then((response) => {
          if (response.data.permit) {
            for (let i = 0; i < response.data.result.length; i++) {
              this.story.push({
                name: response.data.result[i].name,
                content: response.data.result[i].content,
                path: `myCreation/${response.data.result[i].name}`
              })
            }
          } else {
            Toast({
              message: '发生错误，请稍后再试',
              position: 'middle',
              duration: 1000
            })
          }
        }).catch((error) => {
          if (error) {
            Toast({
              message: '找不到资源，请检查url',
              position: 'middle',
              duration: 1000
            })
          }
        })
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
    height: 100%;
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
    .create-new-story {
      margin: 10px 25% 20px 25%;
      background-color: $icon-red;
      height: 30px;
      color: white;
      text-align: center;
      line-height:30px;
      border-radius: 5px;
      font-size:16px;
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
</style>
