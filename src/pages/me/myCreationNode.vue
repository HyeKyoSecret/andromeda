<template>
  <div class="my-creation-node">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        塞尔达传说
      </span>
    </div>
    <div v-if="result.root">
      <transition
        name="custom-classes-transition"
        leave-active-class="animated bounceOutUp"
      >
      <div class="open-authorized" v-if="!writeAuthorized">
        <div class="line">
          <div class="name">开放自由续写</div>
          <mt-switch v-model="writePermit" class="switch"></mt-switch>
        </div>
      </div>
      </transition>
      <div class="one-node" @click="goStory(result.root.id)">
        <div class="story-information">
          <div class="cover">
            <div><img src="../../img/photo/LegendofZelda.png" /></div>
            <div class="change-cover">更换封面</div>
          </div>
          <div class="right-part">
            <div class="story-name">
              <span class="name">{{result.root.name}}</span>
              <span class="beginning">开头</span>
            </div>
            <div class="story-content">{{result.root.content}}</div>
            <div class="like-quantity">
              <span><img src="../../img/icon/gray_thumb.png" /></span>
              <span>18次</span>
            </div>
            <div class="time">{{result.root.date}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="result.story">
      <div class="story-preview"  v-for="item in result.story" :key="item.id" @click="goStory(item.id)">
        <div class="content">{{item.content}}</div>
        <div class="info">
          <span><img src="../../img/icon/gray_thumb.png" /></span>
          <span>18</span>
          <span class="date">{{item.date}}</span>
        </div>
      </div>
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import Axios from 'axios'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    components: {
      FootMenu
    },
    data () {
      return {
        rootInfo: {
          name: '',
          content: '',
          date: ''
        },
        temp: {},
        result: {},
        writePermit: true,
        writeAuthorized: true
      }
    },
    watch: {
      writePermit: function (curVal) {
        if (curVal !== false) {
          MessageBox.confirm('开放自由续写后将无法再关闭，确认开放吗?').then(action => {
            Axios.post('/story/changeWritePermit', {
              rootName: this.result.root.name,
              writePermit: curVal
            }).then((response) => {
              if (response.data === 'error') {
                Toast({
                  message: '网络错误，请稍后再试',
                  position: 'middle',
                  duration: 1000
                })
              } else {
                this.writeAuthorized = true
              }
            })
          }).catch(action => {
            this.writePermit = false
          })
        }
      }
    },
    created: function () {
      this.checkUser()
    },
    methods: {
      checkUser: function () {
        Axios.get('/register/checkUser', {
          params: {
            user: this.$route.params.user
          }
        }).then(response => {
          if (response.data.user) {
            if (!response.data.customer) {
              // 本人
              Axios.get('/user/getMyCreation', {
                params: {
                  user: this.$route.params.user
                }
              }).then(response => {
                let arr = response.data.result
                for (let i = 0; i < arr.length; i++) {
                  if (arr[i].root === this.$route.params.rootName) {
                    this.temp = arr[i]
                  }
                }
                Axios.post('/story/getMyCreationPreview', {
                  data: this.temp
                }).then(response => {
                  this.result = response.data
                  if (response.data.root) {
                    this.writeAuthorized = response.data.root.writePermit
                    this.writePermit = this.writeAuthorized
                  }
                })
              })
            } else {
              // 访客
              alert('访客模式')
            }
          } else {
            // 用户名不存在或不合法
            this.$emit('error')
          }
        }).catch((error) => {
          if (error) {
            this.$emit('error')
          }
        })
      },
      goStory: function (id) {
        this.$router.push(`/story/${id}`)
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/animate.min.css";
  @import "../../scss/config";
  .my-creation-node {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
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
    .open-authorized {
      width: 100%;
      border-top: 1px solid $border-gray;
      height: 70px;
      background: white;
      color: $font-dark;
      .line {
        margin-top: 15px;
        display: flex;
        align-items: center;
        .name {
          flex: 5;
          margin-left: 15px;
          font-size: 16px;
        }
        .switch {
          flex: 1;
          margin-left: 15px;
        }
      }
    }
    .one-node {
      height: 145px;
      width: 100%;
      background-color: white;
      margin-top: 25px;
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
          .change-cover {
            height: 20px;
            width: 75px;
            margin: 10px 5px 0 -4px;
            background-color: $main-color;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            text-align: center;
            line-height: 20px;
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
            .beginning {
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
          .story-content {
            margin-top: 3px;
            min-height: 50px;
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
          .like-quantity  {
            text-align: right;
            font-size: 14px;
            color: $font-gray;
            margin-top: 10px;
            img {
              height: 14px;
              width: 14px;
              vertical-align: center;
            }
          }
          .time {
            text-align: right;
            font-size: 14px;
            color: $font-gray;
          }
        }
      }
    }
    .story-preview {
      margin-top: 10px;
      width: 100%;
      background: white;
      &:last-child {
        margin-bottom: 200px;
      }
      .content {
        width: 95%;
        margin: 0 auto;
        padding-top: 15px;
        min-height: 28px;
        display: -webkit-box;
        display: -moz-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        -moz-box-orient: vertical;
        -moz-line-clamp: 2;
        overflow: hidden;
        font-size: 14px;
        color: $font-dark;
      }
      .info {
        height: 30px;
        line-height: 30px;
        margin-top: 15px;
        border-top: 1px solid $bg-gray;
        text-align: right;
        font-size: 14px;
        color: $font-gray;
        img {
          width: 14px;
        }
        .date {
          margin-left: 15px;
          margin-right: 15px;
        }
      }
    }
  }
</style>
