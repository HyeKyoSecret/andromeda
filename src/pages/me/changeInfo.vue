<template>
  <div class="change-user-info">
    <notice :title="title"></notice>
    <div class="me-content">
      <div class="user-main">
        <div class="head-img">
          <img :src="headImg" @error="setErrorImg">
        </div>
        <div class="words">
          <div class="name">{{nickname}}</div>
          <div class="sign"  @click="openTextArea">
            {{sign}}
          </div>
        </div>
        <div class="icon" v-if="isUser">
          <img src="../../img/icon/right.png" @click="openTextArea">
        </div>
      </div>
      <div class="user-operation">
        <div class="line">
          <div class="left">
            性别
          </div>
          <div class="right" @click="openChangeSex">
            <div class="words">
              {{sex}}
            </div>
            <div class="icon" v-if="isUser">
              <img src="../../img/icon/right.png">
            </div>
          </div>
        </div>
        <div class="line">
          <div class="left">
            生日
          </div>
          <div class="right" @click="openDatePicker">
            <div class="words">
              {{birthday}}
            </div>
            <div class="icon" v-if="isUser">
              <img src="../../img/icon/right.png">
            </div>
          </div>
        </div>
      </div>
      <div class="quit" v-if="isUser" @click="quitLogin">
        退出账号
      </div>
      <foot-menu></foot-menu>
    </div>
    <date-picker ref="picker" v-on:refresh="getData" v-bind:id="userId"></date-picker>
    <mt-radio ref="radio" v-on:refresh="getData" v-bind:id="userId"></mt-radio>
    <sign-text-area ref="text" v-on:refresh="getData" v-bind:id="userId"></sign-text-area>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .change-user-info {
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
    margin-top: 11px;
    font-size: 13px;
    color: $w-gray;
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
  .user-operation {
    margin-top: 30px;
  .line {
    display: flex;
    align-items: center;
    height: 42px;
    width: 100%;
    background: white;
  .left{
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 25px;
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
    line-height: 42px;
    text-align: right;
    padding-right: 20px;
    font-size: 14px;
  }
  .icon {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  img {
    margin-right: 11px;
    width: 12px;
    height: 20px;
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
  .quit {
    width: 100%;
    height: 42px;
    color: red;
    background: white;
    margin-top: 60px;
    line-height: 42px;
    text-align: center;
  }
  }
  .foot-menu {
    width: 100%;
    height: 46px;
    background: white;
    position: fixed;
    bottom: 0;
    margin: auto;
    display: flex;
  .button{
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    text-align: center;
  img {
    margin: 4px auto 0 auto;
    width: 21px;
    height: 21px;
  }
  font-size: 12px;
  }
  .discovery {
    flex: 2;
  img {
    position: absolute;
    top: -13px;
    left: 50%;
    width: 58px;
    height: 44px;
    margin-left: -29px;
  }
  }
  }
  }
</style>
<script>
  import Axios from 'axios'
  import { Toast, MessageBox } from 'mint-ui'
  import FootMenu from '../../components/foot-menu.vue'
  import DatePicker from '../../components/me/changeInfo/changeBirthday.vue'
  import MtRadio from '../../components/me/changeInfo/changeSex.vue'
  import notice from '../../components/notice/notice.vue'
  import SignTextArea from '../../components/me/changeInfo/changeSign.vue'
  export default {
    data () {
      return {
        isUser: false,
        userId: this.$route.params.user,
        birthday: '',
        sex: '',
        nickname: '',
        sign: '',
        headImg: ''
      }
    },
    created: function () {
      this.checkUser()
      this.getData()
    },
    computed: {
      title: function () {
        if (this.isUser) {
          return '我的资料'
        } else {
          if (this.sex === '男') {
            return '他的资料'
          } else if (this.sex === '女') {
            return '她的资料'
          } else {
            return 'Ta的资料'
          }
        }
      }
    },
    methods: {
      checkUser () {
        Axios.get('/register/checkUser', {
          params: {
            user: this.$route.params.user
          }
        }).then(res => {
          if (res.data.user) {
            this.nickName = res.data.user.nickName
            this.isUser = !res.data.customer  // 是否是访客
          } else {
            this.$emit('error')
          }
        }).catch(error => {
          if (error) {
            this.$emit('error')
          }
        })
      },
      openDatePicker () {
        if (this.isUser) {
          this.$refs.picker.openPicker()
        }
      },
      openChangeSex () {
        if (this.isUser) {
          this.$refs.radio.openRadio()
        }
      },
      openTextArea () {
        if (this.isUser) {
          this.$refs.text.openSignView()
        }
      },
      quitLogin () {
        MessageBox({
          title: '提示',
          message: '确定退出登录吗?',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            Axios.get('/register/quitLogin')
              .then(response => {
                if (!response.data.error) {
                  this.$router.push('/login')
                  Toast({
                    message: '退出成功',
                    position: 'middle',
                    duration: 800
                  })
                  this.checkUser()
                } else {
                  Toast({
                    message: response.data.message,
                    position: 'middle',
                    duration: 800
                  })
                  this.checkUser()
                }
              })
          }
        }).catch(action => {
        })
      },
      getData () {
        Axios.get('/user/getChangeInfo', {
          params: {
            id: this.$route.params.user
          }
        }).then(response => {
          if (!response.data.error) {
            this.birthday = response.data.birthday || '未设置'
            this.sex = response.data.sex || '未设置'
            this.nickname = response.data.nickname
            this.sign = response.data.sign || '这个人很懒，什么都没留下'
            this.headImg = response.data.headImg
          }
        })
      },
      setErrorImg () {
        this.headImg = require('../../img/images/defaultHeadImg.png')
      }
    },
    components: {
      FootMenu,
      DatePicker,
      MtRadio,
      notice,
      SignTextArea
    }
  }
</script>
