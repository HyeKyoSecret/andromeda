<template>
  <div class="login" :style="{'height': pageHeight}">
    <div class="notice">
      <span class="icon" @click="$router.go(-1)">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        登录
      </span>
    </div>
    <div class="logo-show">
      <div class="logo">
        <img src="../../img/images/killerwhale._logo.png" alt="">
      </div>
    </div>
    <div class="login-input" :class="{'captcha': inputCheck}">
      <div>
        <input type="text" placeholder="用户名" v-model.trim="username" @blur="userCheck">
        <span class="error-info">{{usernameError}}</span>
      </div>
      <div>
        <input type="password" placeholder="密码" v-model.trim="password" @blur="passwordCheck">
        <span class="error-info">{{passwordError}}</span>
      </div>
      <div v-if="inputCheck">
        <input type="text" placeholder="验证码" v-model.trim="captcha" @blur="passwordCheck">
        <span class="vc" v-html='captchaPic' @click="getCaptcha"></span>
      </div>
    </div>
    <div class="goRegister">
      您还没有账号？前往<router-link to="/register">注册</router-link>
    </div>
    <div class="login-btn" @click="login" v-if="inputCheck && this.captcha.length === 4">
      登录
    </div>
    <div class="fake-login-btn" v-else>
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
        captchaPic: null,
        windowHeight: window.innerHeight,
        changedHeight: 0,
        pageHeight: window.innerHeight + 'px'
      }
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    },
    components: {
      FootMenu
    },
    computed: {
      inputCheck: function () {
        let userReg = /^[0-9a-zA-Z_]{6,16}$/
        let pwReg = /^[A-Za-z0-9]{6,16}$/
        if (userReg.test(this.username) && pwReg.test(this.password)) {
          this.getCaptcha()
          return true
        } else {
          return false
        }
      }
    },
    mounted: function () {
      window.addEventListener('resize', this.getHeight)
      this.getCaptcha()
    },
    methods: {
      getHeight () {
        this.changedHeight = window.innerHeight
        if (this.windowHeight - this.changedHeight > 50) {
          this.pageHeight = this.windowHeight + 'px'
        } else {
          this.pageHeight = '100%'
        }
      },
      getCaptcha () {
        Axios.get('/register/getLoginCaptcha')
          .then((response) => {
            this.captchaPic = response.data
          })
          .catch((error) => {
            console.log(error)
            this.captchaPic = '<span style="line-height: 48px">验证码错误</span>'
          })
      },
      userCheck () {
        if (this.username.length) {
          let userReg = /^[0-9a-zA-Z_]{6,16}$/
          if (!userReg.test(this.username)) {
            this.usernameError = '格式错误'
          } else {
            this.usernameError = ''
          }
        } else {
          this.usernameError = '不能为空'
        }
      },
      passwordCheck () {
        if (this.password.length) {
          let pwReg = /^[A-Za-z0-9]{6,16}$/
          if (!pwReg.test(this.password)) {
            this.passwordError = '格式错误'
          } else {
            this.passwordError = ''
          }
        } else {
          this.passwordError = '不能为空'
        }
      },
      login () {
        let userReg = /^[0-9a-zA-Z_]{6,16}$/
        let passwordReg = /^[A-Za-z0-9]{6,16}$/
        if (this.username && this.password && userReg.test(this.username) && passwordReg.test(this.password) && this.captcha) {
          Axios.post('/register/login', {
            username: this.username,
            password: this.password,
            captcha: this.captcha
          }).then((response) => {
            if (response.data) {
              try {
                if (!response.data.permit) {
                  this.getCaptcha()
                  throw new Error(response.data.message)
                } else {
                  Toast({
                    message: response.data.message,
                    position: 'middle',
                    duration: 1000
                  })
                  this.$router.go(-1)
                }
              } catch (e) {
                this.getCaptcha()
                Toast({
                  message: e.message,
                  position: 'middle',
                  duration: 1000
                })
              }
            } else {
              this.getCaptcha()
              Toast({
                message: '登录失败',
                position: 'middle',
                duration: 1000
              })
            }
          }).catch(error => {
            if (error) {
              Toast({
                message: '登录失败',
                position: 'middle',
                duration: 1000
              })
            }
          })
        } else {
          this.getCaptcha()
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
      text-align: center;
      img {
        margin-top: 30px;
        width: 80px;
      }
    }
    .login-input {
      width: 80%;
      margin: 0 auto;
      border-radius: 9px;
      height: 100px;
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
          flex: 3;
          height: 42px;
          font-size: 14px;
          overflow: hidden;
          width: 100%;
        }
        &:last-child {
          border: none;
          input{
            flex: 3;
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
    .login-input.captcha {
      height: 149px;
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
    .fake-login-btn {
      width: 80%;
      height: 42px;
      border-radius: 8px;
      margin: 20px auto 0 auto;
      background: rgba(150, 210, 142, 0.6);
      color: white;
      text-align: center;
      line-height: 42px;
      font-size: 14px;
    }
  }
</style>
