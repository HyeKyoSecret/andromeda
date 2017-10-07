<template>
  <div class="message">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        我的消息
      </span>
    </div>
    <div class="button-bar">
      <div class="button">
        <div>
          <router-link tag='span' to='/me/message/words' class="words">留言</router-link>
        </div>
        <div>
          <router-link tag='span' to='/me/message/request' class="request">请求</router-link>
        </div>
        <div>
          <router-link tag='span' to='/me/message/promote' class="promote">提示</router-link>
        </div>
        <div>
          <router-link tag='span' to='/me/message/announcement' class="announcement">公告</router-link>
        </div>
      </div>
    </div>
    <router-view></router-view>
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
  @import "../../scss/style.css";
  @import "../../scss/config";
  .message {
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
    .button-bar {
      width: 100%;
      background: white;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .button {
        width: 90%;
        height: 26px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          flex: 1;
          height: 26px;
          width: 30px;
          text-align: center;
          line-height: 26px;
          span {
            display: inline-block;
            width: 48px;
            height: 26px;
            background: red;
            color: white;
          }
          .words {
            background: $main-color;
          }
          .request {
            background: $icon-red;
          }
          .promote {
            background: $icon-blue;
          }
          .announcement {
            background: $icon-yellow;
          }
        }
      }
    }
  }
</style>
