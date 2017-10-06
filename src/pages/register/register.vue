<template>
  <div class="register">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        注册
      </span>
    </div>
    <div class="logo-show">
      <div class="logo"></div>
      <div class="logo-words"></div>
    </div>
    <div class="register-input">
      <div>
        <input type="text" v-model="userName" placeholder="用户名(邮箱或手机号)" @change="userNameValidator">
        <span class="error-info">{{userNameError}}</span>
      </div>
      <div>
        <input type="text" v-model="nickName" placeholder="昵称" @change="nickNameValidator">
        <span class="error-info">{{nickNameError}}</span>
      </div>
      <div>
        <input type="password" v-model="password" placeholder="密码" @change="passwordValidator">
        <span class="error-info">{{passwordError}}</span>
      </div>
      <div>
        <input type="password" v-model="confirmPs" placeholder="再次确认密码" @change ="confirmPsValidator">
        <span class="error-info">{{confirmPsError}}</span>
      </div>
      <div>
        <input type="text" v-model="captcha" placeholder="验证码">
        <span class="error-info"></span>
        <span class="vc"></span>
      </div>
    </div>
    <div class="licence">
      <p>点击「注册」，即代表你同意《仙女座用户协议》</p>
    </div>
    <div class="register-btn" v-if="this.registerPermit">
      注册
    </div>
    <div class="fake-register-btn" v-else>
      注册
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  export default {
    data () {
      return {
        userName: '',
        userNameError: '',
        nickName: '',
        nickNameError: '',
        password: '',
        passwordError: '',
        confirmPs: '',
        confirmPsError: '',
        captcha: '',
        captchaError: '',
        userCheck: false,
        nickCheck: false,
        psCheck: false,
        cfCheck: false
      }
    },
    computed: {
      registerPermit: function () {
        return this.userCheck && this.nickCheck && this.psCheck && this.cfCheck
      }
    },
    methods: {
      userNameValidator () {
        let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        let phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
        if (this.userName && (emailReg.test(this.userName) || phoneReg.test(this.userName))) {
          // 正常逻辑
          this.userNameError = ''
          this.userCheck = true
        } else {
          this.userNameError = '用户名格式错误'
          this.userCheck = false
        }
      },
      nickNameValidator () {
        let nickReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
        if (this.nickName && nickReg.test(this.nickName)) {
          // 正常逻辑，昵称不能重复
          this.nickNameError = ''
          this.nickCheck = true
        } else {
          this.nickNameError = '昵称只能包含字母数字和下划线'
          this.nickCheck = false
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
          this.passwordError = '密码必须是6-16位的数字字母'
        }
      },
      confirmPsValidator () {
        if (this.confirmPs !== this.password) {
          this.confirmPsError = '两次输入的密码不一致'
          this.cfCheck = false
        } else {
          this.confirmPsError = ''
          this.cfCheck = true
        }
      }
    },
    components: {
      FootMenu
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
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
    }
    .register-input {
      width: 80%;
      margin: 0 auto;
      border-radius: 9px;
      height: 248px;
      background: white;
      div {
        width: 96%;
        border-bottom: 1px solid $border-gray;
        height: 49px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        input {
          flex: 7;
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
            flex: 1;
          }
          .error-info {
            flex: 1;
          }
          .vc {  // 临时占位 验证码
            flex: 1;
            background: yellow;
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
      width: 75%;
      height: 42px;
      border-radius: 8px;
      margin: 20px auto 0 auto;
      background: $main-color;
      color: white;
      text-align: center;
      line-height: 42px;
    }
    .fake-register-btn {
      width: 75%;
      height: 42px;
      border-radius: 8px;
      margin: 20px auto 0 auto;
      background: rgba(150, 210, 142, 0.6);
      color: white;
      text-align: center;
      line-height: 42px;
    }
  }
</style>
