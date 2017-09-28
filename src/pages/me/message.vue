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
      <div class="content">
        <div >
          <span class="words">留言</span>
        </div>
        <div>
          <span class="request">请求</span>
        </div>
        <div>
          <span class="promote">提示</span>
        </div>
        <div>
          <span class="announcement">公告</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
</script>
<style lang='scss' scoped>
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
      .content {
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
