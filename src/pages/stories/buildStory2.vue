<template>
  <div class="new-story">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        添加封面图片
      </span>
      <span class="next-step">
        下一步
      </span>
    </div>
    <div class="story-name">
      塞尔达传说
    </div>
    <div class="story-pic">
      <img src="../../img/photo/defaultPic.png"/>
    </div>
    <div class="error-info">
      上传的图片大小过大
    </div>
    <div class="recommend">
      *建议上传3:4 比例的图片
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import "../../scss/config";
  .new-story {
    height: 100%;
    width: 100%;
    background: white;
    .notice { // 新建notice
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
    .story-name {
      text-align: center;
      color: $font-dark;
      font-size: 16px;
      margin-top: 30px;
    }
    .story-pic {
      margin-top: 30px;

      display: flex;
      align-items: center;
      justify-content: center;
      img{
        height:160px;
        width: 170px;
        padding: 107px 55px 107px 55px;
        border: 2px solid $border-gray;
      }
    }
    .error-info {
      text-align: center;
      color: $main-red;
      margin-top: 10px;
    }
    .recommend {
      text-align: center;
      color: $font-gray;
      margin-top: 10px;
    }
  }
  </style>
