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
        <input type="text" placeholder="用户名">
        <span class="error-info">这里是错误信息</span>
      </div>
      <div>
        <input type="text" placeholder="密码">
        <span class="error-info"></span>
      </div>
      <div>
        <input type="text" placeholder="验证码">
        <span class="error-info"></span>
        <span class="vc"></span>
      </div>
    </div>
    <div class="goRegister">
      您还没有账号？前往<router-link to="/register">注册</router-link>
    </div>
    <div class="login-btn">
      登录
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  export default {
    components: {
      FootMenu
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
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
          .vc {  // 临时占位 验证码
            flex: 1;
            background: yellow;
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
