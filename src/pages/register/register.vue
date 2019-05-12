<template>
  <div class="register">
    <div class="notice">
      <span class="icon" @click="$router.go(-1)">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        注册
      </span>
    </div>
    <div class="logo-show">
      <div class="logo">
        <img src="../../img/images/killerwhale._logo.png" alt="">
      </div>
    </div>
    <div class="register-input">
      <div>
        <input type="text" v-model.trim="userName" placeholder="用户名" @blur="userNameValidator">
        <span class="error-info">{{userNameError}}</span>
      </div>
      <div>
        <input type="text" v-model.trim="nickName" placeholder="昵称" @blur="nickNameValidator">
        <span class="error-info">{{nickNameError}}</span>
      </div>
      <div>
        <input type="password" v-model.trim="password" placeholder="密码" @blur="passwordValidator">
        <span class="error-info">{{passwordError}}</span>
      </div>
      <div>
        <input type="text" v-model.trim="captcha" placeholder="验证码">
        <span class="vc" v-html='captchaPic' @click="getCaptcha">
        </span>
      </div>
    </div>
    <div class="licence">
      <p>点击「注册」，即代表你同意《仙女座用户协议》</p>
    </div>
    <div class="register-btn" v-if="this.registerPermit" @click ="register">
      注册
    </div>
    <div class="fake-register-btn" v-else>
      注册
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  import FootMenu from '../../components/foot-menu.vue'
  export default {
    data () {
      return {
        captchaPic: null,
        userName: '',
        userNameError: '',
        nickName: '',
        nickNameError: '',
        password: '',
        passwordError: '',
        captcha: '',
        captchaError: '',
        userCheck: false,
        nickCheck: false,
        psCheck: false
      }
    },
    computed: {
      registerPermit: function () {
        return this.userCheck && this.nickCheck && this.psCheck && (this.captcha.length === 5)
      }
    },
    created: function () {
      this.getCaptcha()
    },
    methods: {
      getCaptcha () {
        Axios.get('/register/getCaptcha')
          .then((response) => {
            this.captchaPic = response.data
          })
          .catch((error) => {
            console.log(error)
            this.captchaPic = '<span style="line-height: 48px">获取错误</span>'
          })
      },
      checkUserRepeated () {
        Axios.post('/register/checkUserRepeated', {
          username: this.userName
        }).then((response) => {
          if (response.data === '用户名已经存在') {
            this.userNameError = response.data
            this.userCheck = false
          } else {
            this.userNameError = ''
            this.userCheck = true
          }
        })
      },
      checkNickRepeated () {
        Axios.post('/register/checkNickRepeated', {
          nickname: this.nickName
        }).then((response) => {
          if (response.data === '昵称已经存在') {
            this.nickNameError = response.data
            this.nickCheck = false
          } else {
            this.nickNameError = ''
            this.nickCheck = true
          }
        })
      },
      userNameValidator () {
        let userReg = /^[0-9a-zA-Z_]+$/    // 字母数字下划线
        if (this.userName.length >= 6 && this.userName.length <= 16) {
          if (this.userName && (userReg.test(this.userName))) {
            this.userNameError = ''
            // 运行用户名重名检查
            this.checkUserRepeated()
          } else {
            this.userNameError = '用户名只能包含字母、数字、下划线'
            this.userCheck = false
          }
        } else {
          this.userNameError = '用户名必须在6-16位之间'
        }
      },
      nickNameValidator () {
        let nickReg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
        if (this.nickName.length >= 2 && this.nickName.length <= 7) {     // 位数检查
          if (this.nickName && nickReg.test(this.nickName)) {     // 正则检查
            this.nickNameError = ''
            this.nickCheck = true
            // 正常逻辑，昵称不能重复
            if (this.nickName !== this.userName) {             // 不与用户名重复检查
              this.checkNickRepeated()                         // 不重名检查
            } else {
              this.nickNameError = '昵称不得与用户名相同'
              this.nickCheck = false
            }
          } else {
            this.nickNameError = '昵称只能包含字母、数字、中文'
            this.nickCheck = false
          }
        } else {
          this.nickCheck = false
          this.nickNameError = '昵称长度必须在2-7位之间'
        }
      },
      passwordValidator () {
        let psReg = /^[A-Za-z0-9]+$/  // 字母数字
        if (this.password.length >= 6 && this.password.length <= 16) {
          if (psReg.test(this.password)) {
            this.passwordError = ''
            // 正常逻辑
            this.psCheck = true
          } else {
            this.passwordError = '密码只能包含数字和字母'
            this.psCheck = false
          }
        } else {
          this.psCheck = false
          this.passwordError = '密码必须是6-16位的数字字母'
        }
      },
      register () {
        Axios.post('/register', {
          username: this.userName,
          nickname: this.nickName,
          password: this.password,
          captcha: this.captcha
        }).then((response) => {
          Toast({
            message: response.data.message,
            position: 'middle',
            duration: 1000
          })
          if (response.data.error) {
            this.getCaptcha()
          } else {
            this.$router.push('/')
          }
        })
      }
    },
    components: {
      FootMenu
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .register {
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
      text-align: center;
      img {
        margin-top: 30px;
        width: 80px;
      }
    }
    .register-input {
      width: 80%;
      margin: 0 auto;
      border-radius: 9px;
      height: 200px;
      background: white;
      div {
        width: 96%;
        border-bottom: 1px solid $border-gray;
        height: 49px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        input {
          flex: 10;
          height: 39px;
          color: #333333;
          border: none;
          outline: none;
          padding-left: 5px;
          font-size: 14px;
          overflow: hidden;
        }
        &:last-child {
          border: none;
          input{
            flex: 2;
          }
          .error-info {
            flex: 1;
          }
          .vc {  // 临时占位 验证码
            flex: 1;
            width: 100%;
            height: 100%;
          }
        }
        .error-info {
          flex: 4;
          font-size: 12px;
          color: $main-red;
        }
      }
    }
    .licence {
      width: 75%;
      margin: 20px auto 0 auto;
      font-size: 12px;
      color: $w-gray;
      text-align: center;
      p {
        margin: 0;
      }
    }
    .register-btn {
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
    .fake-register-btn {
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
