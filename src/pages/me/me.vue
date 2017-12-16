<template>
  <div class="me">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        我
      </span>
    </div>
    <div class="me-content">
      <div class="user-main" v-if="isLogin">
        <div class="head-img">
          <img src="../../img/photo/head.jpg">
        </div>
        <div class="words">
          <div class="name">{{nickName}}</div>
          <div class="sign">
            在乌云和尘埃之后是真理之光，他最终会投射出来并含笑驱散它们。
          </div>
          <div class="info">
            <img src="../../img/icon/zan.png">
            <div>4399</div>
          </div>
        </div>
        <div class="icon">
          <img src="../../img/icon/right.png">
        </div>
      </div>
      <router-link to='/login' tag="div" class="fake-user-main" v-else>
        <p>登陆仙女座，</p>
        <p>链接你与Ta们的故事</p>
      </router-link>
        <div class="user-operation">
          <router-link :to='item.path' tag='div' class="line" v-for='item in operation' :key="item.name">
            <div class="left">
              <img :src='item.icon'>
            </div>
            <div class="right">
              <div class="words">
                {{item.name}}
              </div>
              <div class="icon">
                <img src="../../img/icon/right.png">
              </div>
            </div>
          </router-link>
        </div>
      <router-view></router-view>
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
  .me {
    height: 100%;
    background: $bg-gray;
    .notice {
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      span{
        text-align: center;
        font-size: 16px;
      }
      img {
        position: absolute;
        top: 10px;
        left: 11px;
        width: 12px;
        height: 20px;
      }
    }
    .me-content {
      .user-main {
        height: 95px;
        background: white;
        display: flex;
        align-items: center;
        padding: 11px 11px 11px 12px;
        border-top: 1px solid $border-gray;
        border-bottom: 1px solid $border-gray;
        margin-top: 20px;
        .head-img{
          flex: 2;
          img {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            margin-left: 5px;
          }
        }
        .words {
          flex: 7;
          height: 100%;
          font-size: 15px;
          font-weight: 500;
          padding: 0 20px 0 20px;
          .name {
            margin-top: 8px;
          }
          .sign {
            margin-top: 6px;
            font-size: 13px;
            color: $w-gray;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            -moz-box-orient: vertical;
            -moz-line-clamp: 2;
            overflow: hidden;
          }
          .info {
            margin-top: 7px;
            font-size: 13px;
            color: $w-gray;
            img {
              width: 15px;
              height: 14px;
            }
            div {
              display: inline-block;
              margin-left: 8px;
              position: relative;
              top: -2px;
            }
          }
        }
        .icon {
          flex: 1;
          height: 100%;
          width: 100%;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          img {
            height: 25px;
            width: 14px;
          }
        }
      }
      .fake-user-main {
        height: 95px;
        width: 100%;
        background: white;
        display: flex;
        align-items: center;
        padding: 11px 0 11px 0;
        flex-wrap: nowrap;
        flex-direction: column;
        p {
          text-align: left;
          margin: 10px 0 0 10px;
          font-size: 18px;
          &:first-child {
            margin-left: -35%;
          }
          &:last-child {
            margin-left: 35%
          }
        }
      }
      .user-operation {
        margin-top: 30px;
        .line {
          display: flex;
          align-items: center;
          height: 50px;
          width: 100%;
          background: white;
          .left{
            flex: 1;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 32px;
              height: 32px;
            }
          }
          .right {
            flex: 4;
            display: flex;
            height: 100%;
            align-items: center;
            font-size: 15px;
            border-bottom: 1px solid $border-gray;
            .words {
              flex: 7;
              height: 100%;
              margin-left: 15px;
              line-height: 50px;
            }
            .icon {
              flex: 1;
              height: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              img {
                margin-right: 11px;
                width: 13px;
                height: 21px;
              }
            }
          }
          &:last-child{
            .right {
              border: none;
            }
          }
        }

      }
    }
  }
</style>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import Axios from 'axios'
  export default {
    data () {
      return {
        operation: [
          {
            name: '我的消息',
            icon: require('../../img/icon/my_message.png'),
            path: '/people/message/words'
          },
          {
            name: '我的创作',
            icon: require('../../img/icon/my_creation.png'),
            path: `/people/creation`
          },
          {
            name: '我的订阅',
            icon: require('../../img/icon/my_subscription.png'),
            path: '/people/subscribe'
          },
          {
            name: '我的关注',
            icon: require('../../img/icon/my_focus.png'),
            path: '/people/message/words'
          },
          {
            name: '我的好友',
            icon: require('../../img/icon/my_friend.png'),
            path: '/people/message/words'
          },
          {
            name: '我的轨迹',
            icon: require('../../img/icon/my_trail.png'),
            path: '/people/message/words'
          }
        ],
        isUser: false,
        userStatus: '',
        nickName: ''
      }
    },
    computed: {
      isLogin: function () {
        return this.userStatus !== 'askLogin'
      }
    },
    created: function () {
      this.checkUser()
    },
    methods: {
      checkUser () {
        if (typeof this.$route.params.user === 'undefined') {
          Axios.get('/register/checkLogin')
            .then((response) => {
              if (response.data.login) {
                this.nickName = response.data.nickName
                this.userStatus = 'isUser'
                for (let i = 0; i < this.operation.length; i++) { // 修改path
                  let pathArray = this.operation[i].path.split('/')
                  this.operation[i].path = `/${pathArray[1]}/${response.data.user}/${pathArray[2]}`
                }
              } else {
                this.userStatus = 'askLogin'
              }
            }).catch(error => {
              if (error) {
                // 错误处理
              }
            })
        } else {
          Axios.get('/register/checkUser', {
            params: {
              user: this.$route.params.user
            }
          }).then(res => {
            if (res.data.user) {
              this.nickName = res.data.user.nickName
              if (res.data.customer) {
                alert('访客模式,url尚未完成')
                this.userStatus = 'isCustomer'
              } else {
                this.userStatus = 'isUser'
                for (let i = 0; i < this.operation.length; i++) { // 修改path
                  let pathArray = this.operation[i].path.split('/')
                  this.operation[i].path = `/${pathArray[1]}/${res.data.user.user}/${pathArray[2]}`
                }
              }
            } else {
              alert(res.data.user)
            }
          }).catch(error => {
            alert('error' + error)
          })
        }
      }
    },
    components: {
      FootMenu
    }
  }
</script>
