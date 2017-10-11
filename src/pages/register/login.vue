<template>
  <div class="login">
    <div class="notice">
      <span class="icon" @click="$router.go(-1)">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        登录
      </span>
    </div>
    <div class="logo-show">
      <div class="logo"></div>
      <div class="logo-words"></div>
    </div>
    <div class="login-input">
      <div>
        <input type="text" placeholder="用户名" v-model.trim="username" @blur="userCheck">
        <span class="error-info">{{usernameError}}</span>
      </div>
      <div>
        <input type="password" placeholder="密码" v-model.trim="password" @blur="passwordCheck">
        <span class="error-info">{{passwordError}}</span>
      </div>
      <div>
        <input type="text" placeholder="验证码" v-model.trim="captcha" @blur="passwordCheck">
        <span class="vc" v-html='captchaPic' @click="getCaptcha"></span>
      </div>
    </div>
    <div class="goRegister">
      您还没有账号？前往<router-link to="/register">注册</router-link>
    </div>
    <div class="login-btn" @click="login">
      登录
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        username: '',
        usernameError: '',
        password: '',
        passwordError: '',
        captcha: '',
        captchaPic: null
      }
    },
    components: {
      FootMenu
    },
    created: function () {
      this.getCaptcha()
    },
    methods: {
      getCaptcha () {
        Axios.get('/login/getCaptcha')
          .then((response) => {
            this.captchaPic = response.data
          })
          .catch((error) => {
            console.log(error)
            this.captchaPic = '<span style="line-height: 48px">验证码获取错误</span>'
          })
      },
      userCheck () {
        if (this.username.length) {
          let userReg = /^[0-9a-zA-Z_]{6,16}$/
          if (!userReg.test(this.username)) {
            this.usernameError = '用户名格式错误'
          } else {
            this.usernameError = ''
          }
        } else {
          this.usernameError = '用户名不能为空'
        }
      },
      passwordCheck () {
        if (this.password.length) {
          let pwReg = /^[A-Za-z0-9]{6,16}$/
          if (!pwReg.test(this.password)) {
            this.passwordError = '密码格式错误'
          } else {
            this.passwordError = ''
          }
        } else {
          this.passwordError = '密码不能为空'
        }
      },
      login () {
        let userReg = /^[0-9a-zA-Z_]{6,16}$/
        let passwordReg = /^[A-Za-z0-9]{6,16}$/
        if (this.username && this.password && userReg.test(this.username) && passwordReg.test(this.password) && this.captcha) {
          Axios.post('/login', {
            username: this.username,
            password: this.password,
            captcha: this.captcha
          }).then((response) => {
            console.log(response)
            if (response.data) {
              try {
                console.log(response.data.permit + 'permit')
                if (!response.data.permit) {
                  throw new Error(response.data.message)
                } else {
                  Toast({
                    message: response.data.message,
                    position: 'middle',
                    duration: 1000
                  })
                  this.$router.push({name: 'me', params: { username: this.username }})
                }
              } catch (e) {
                Toast({
                  message: e.message,
                  position: 'middle',
                  duration: 1000
                })
              }
            } else {
              Toast({
                message: '登录失败',
                position: 'middle',
                duration: 1000
              })
            }
          })
        } else {
          Toast({
            message: '输入信息有误',
            position: 'middle',
            duration: 1000
          })
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .login {
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
    .logo-show{
      width: 100%;
      height: 130px;
    }
    .login-input {
      width: 80%;
      margin: 0 auto;
      border-radius: 9px;
      height: 149px;
      background: white;
      div {
        width: 96%;
        border-bottom: 1px solid $border-gray;
        height: 49px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        input {
          color: #333333;
          border: none;
          outline: none;
          padding-left: 5px;
          flex: 2;
          height: 42px;
          font-size: 14px;
          overflow: hidden;
        }
        &:last-child {
          border: none;
          input{
            flex: 1;
          }
          .error-icon {
            flex: 1;
          }
          .vc {  //  验证码
            flex: 1;
            width: 100%;
            height: 100%;
          }
        }
        .error-info {
          flex: 1;
          font-size: 12px;
          color: $main-red;
        }
      }
    }
    .goRegister {
      width: 80%;
      margin: 20px auto 0 auto;
      text-align: center;
      color: $w-gray;
      a {
        color: $main-color;
      }
    }
    .login-btn {
      width: 80%;
      height: 42px;
      border-radius: 8px;
      margin: 20px auto 0 auto;
      background: $main-color;
      color: white;
      text-align: center;
      line-height: 42px;
      font-size: 14px;
    }
  }
</style>
