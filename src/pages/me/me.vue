<template>
  <div class="me">
    <notice v-bind:title="title"></notice>
    <div class="me-content">
      <div class="user-main" v-if="isLogin">
        <div class="head-img">
          <img src="../../img/photo/head.jpg">
        </div>
        <div class="words" @click="goChangeInfo(userId)">
          <div class="name">{{nickName}}</div>
          <div v-if="isLoginCustomer" class="f-btn">
            <!--<div class="focus-btn">-->
              <!--+ 关注-->
            <!--</div>-->
            <div class="cancel-focus-btn">
              取消关注
            </div>
          </div>
          <div class="sign">
            在乌云和尘埃之后是真理之光，他最终会投射出来并含笑驱散它们。
          </div>
          <div class="info">
            <img src="../../img/icon/zan.png">
            <div>4399</div>
          </div>
        </div>
        <div class="icon" @click="goChangeInfo(userId)">
          <img src="../../img/icon/right.png">
        </div>
      </div>
      <router-link to='/login' tag="div" class="fake-user-main" v-else>
        <p>登录仙女座，</p>
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
        <div v-if="isLoginCustomer">
          <div class="add-friend" @click="addFriend" v-if="!(cond1 && cond2)">
            添加好友
          </div>
          <div class="delete-friend" @click="deleteFriend" v-if="cond1 && cond2">
            删除好友
          </div>
        </div>
      <router-view></router-view>
    </div>
    <foot-menu v-if="!isLoginCustomer"></foot-menu>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .me {
    height: 100%;
    background: $bg-gray;
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
          padding: 0 15px 0 15px;
          .name {
            display: inline-block;
            margin-top: 8px;
            font-size: 15px;
          }
          .f-btn {
            display: inline-block;
            .focus-btn, .cancel-focus-btn {
              display: inline-block;
              margin-left: 20px;
              color: $main-color;
              border: 1px solid $main-color;
              padding: 2px 8px 2px 8px;
              border-radius: 5px;
            }
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
          .add-friend {
            height: 42px;
            line-height: 42px;
            border-radius: 8px;
            background: $main-color;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            width: 80%;
            margin: 30px auto 0 auto;
          }
          .delete-friend {
            height: 42px;
            line-height: 42px;
            border-radius: 8px;
            background: $main-red;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            width: 80%;
            margin: 30px auto 0 auto;
          }
        }
      }
      .add-friend {
        height: 42px;
        line-height: 42px;
        border-radius: 8px;
        background: $main-color;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        width: 80%;
        margin: 30px auto 0 auto;
      }
      .delete-friend {
        height: 42px;
        line-height: 42px;
        border-radius: 8px;
        background: $main-red;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        width: 80%;
        margin: 30px auto 0 auto;
      }
    }
  }
</style>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import notice from '../../components/notice/notice.vue'
  import { Toast } from 'mint-ui'
  import Axios from 'axios'
  export default {
    components: {
      FootMenu,
      notice
    },
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
            path: '/people/friendList'
          },
          {
            name: '我的轨迹',
            icon: require('../../img/icon/my_trail.png'),
            path: '/people/message/words'
          }
        ],
        cOperation: [
          {
            name: '他的创作',
            icon: require('../../img/icon/my_creation.png'),
            path: `/people/creation`
          },
          {
            name: '他的订阅',
            icon: require('../../img/icon/my_subscription.png'),
            path: '/people/subscribe'
          },
          {
            name: '他的关注',
            icon: require('../../img/icon/my_focus.png'),
            path: '/people/message/words'
          },
          {
            name: '共同好友',
            icon: require('../../img/icon/my_friend.png'),
            path: '/people/message/words'
          },
          {
            name: '他的轨迹',
            icon: require('../../img/icon/my_trail.png'),
            path: '/people/message/words'
          }
        ],
        isUser: false,
        userStatus: '',
        userId: '',
        nickName: '',
        cond1: '',
        cond2: ''
      }
    },
    computed: {
      isLogin: function () {
        return this.userStatus !== 'askLogin'
      },
      isLoginCustomer: function () {
        return this.isLogin && this.userStatus === 'isCustomer'
      },
      title: function () {
        if (this.userStatus === 'isUser') {
          return '我'
        } else if (this.isLogin && this.userStatus === 'isCustomer') {
          return 'Ta'
        } else {
          return '我'
        }
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
                  let pathArray = this.operation[i].path.split('/people')
                  this.operation[i].path = `/people/${response.data.user}${pathArray[1]}`
                }
                this.userId = response.data.user
              } else {
                this.userStatus = 'askLogin'
              }
            }).catch(error => {
              if (error) {
                Toast({
                  message: '发生错误',
                  position: 'middle',
                  duration: 700
                })
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
                this.operation = this.cOperation     // 修改按钮
                this.userStatus = 'isCustomer'
                this.getFriendship()
              } else {
                this.userStatus = 'isUser'
              }
              for (let i = 0; i < this.operation.length; i++) { // 修改path
                let pathArray = this.operation[i].path.split(`/people`)
                this.operation[i].path = `/people/${res.data.user.user}${pathArray[1]}`
              }
              this.userId = res.data.user.user
            } else {
              this.$emit('error')
            }
          }).catch(error => {
            if (error) {
              this.$emit('error')
            }
          })
        }
      },
      goChangeInfo (user) {
        this.$router.push(`/people/${user}/changeInfo`)
      },
      addFriend () {
        Axios.post('/user/addFriendRequest', {
          id: this.$route.params.user
        }).then(response => {
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 800
            })
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 800
            })
          }
        })
      },
      deleteFriend () {
        Axios.post('/user/deleteFriendRequest', {
          id: this.$route.params.user
        }).then(response => {
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 800
            })
          } else {
            this.getFriendship()
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 800
            })
          }
        })
      },
      getFriendship () {
        Axios.get('/user/getUserFriendship', {  // 查询好友关系（按钮显示）
          params: {
            user: this.$route.params.user
          }
        }).then(response => {
          if (!response.data.error) {
            this.cond1 = response.data.cond1
            this.cond2 = response.data.cond2
          }
        })
      }
    }
  }
</script>
