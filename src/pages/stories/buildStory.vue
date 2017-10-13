<template>
  <div class="new-story">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        输入故事名字
      </span>
      <span class="next-step">
        下一步
      </span>
    </div>
    <div class="input-name">
        <div class="input" ><input type="text" placeholder="请输入故事名字"></div>
        <span class="error-info">故事名错误</span>
    </div>
    <div class="gradient-line"></div>
  </div>
</template>
<style lang="scss" scoped>
  @import "../../scss/config";
  .new-story {
    height: 100%;
    width: 100%;
    background: white;
    .notice {           // 新建notice
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        text-align: center;
      }
      .title {
        font-size: 16px;
      }
      .next-step {
        position: absolute;
        top: 10px;
        right: 11px;
        font-size: 14px;
      }
      img {
        position: absolute;
        top: 10px;
        left: 11px;
        width: 12px;
        height: 20px;
      }
    }
    .input-name {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 200px;
      .input {
        width: 100%;
      }
      input {
        padding-top: 15px;
        color: $font-dark;
        border: none;
        outline: none;
        height: 42px;
        font-size: 18px;
        overflow: hidden;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
      }
      span {
        position: absolute;
        right: 40px;
        color: $main-red;
        padding-top: 15px;
      }

    }
    .gradient-line {
        height: 1px;
        background-image: linear-gradient(-90deg,white,#bfbfbf,white);
      }
  }
</style>
