<template>
  <div class="subscribe">
    <notice title="订阅消息"></notice>
    <div class="subscribe-new">
      <div class="left">
        <img src="../../../img/images/yuner.jpg" alt="">
      </div>
      <div class="middle">
        <div class="name">千里不留行</div>
        <div class="content">窗前明月光，疑似地上霜，举头望明月，低头思故乡窗前明月光，疑似地上霜，举头望明月，低头思故乡窗前明月光，疑似地上霜，举头望明月，低头思故乡窗前明月光，疑似地上霜，举头望明月，低头思故乡</div>
      </div>
      <div class="right">
        <div class="date">几天前</div>
        <div class="new-number"><span>3</span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import notice from '../../notice/notice'
  export default {
    components: {
      notice
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .subscribe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: $bg-gray;
    min-height: calc(100vh - 58px);
    z-index: 997;
    .subscribe-new {
      margin-top: 50px;
      width: 100%;
      height: 90px;
      display: flex;
      background: white;
      align-items: center;
      .left {
        flex: 1;
        margin-left: 8px;
        img {
          border-radius: 2px;
          width: 51px;
          height: 68px;
        }
      }
      .middle {
        height: 70px;
        margin-left: 10px;
        flex: 5;
        .name {
          color: $font-dark;
        }
        .content {
          margin-top: 5px;
          color: $font-color;
          display: -webkit-box;
          display: -moz-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          -moz-box-orient: vertical;
          -moz-line-clamp: 2;
          overflow: hidden;
        }
      }
      .right {
        height: 70px;
        flex: 1px;
        margin-left: 5px;
        .date {
          height: 25px;
          color: $font-gray;
          font-size: 13px;
        }
        .new-number {
          height: 45px;
          text-align: right;
          margin-top: 15px;
          margin-right: 15px;
          span {
            color: white;
            display: inline-block;
            background: $main-red;
            width: 16px;
            height: 16px;
            border-radius: 2000px;
            text-align: center;
            line-height: 16px;
          }
        }
      }
    }
  }
</style>
