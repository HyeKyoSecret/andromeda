<template>
  <div class="new-story">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        书写开头
      </span>
    </div>
    <div class="story-name">
      塞尔达传说
    </div>
    <div class="context">
      <textarea  name="context" placeholder="在这里书写您的故事"></textarea>
    </div>
    <div class="permission">
      <div class="radio"><img src="../../img/icon/radio_selected.png" /></div>
      <div class="authority">开放自由改写</div>
    </div>
    <div class="post">
      发布
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
      color : $font-dark;
      font-size: 16px;
      margin-top: 20px;
    }
    .context  {
      display:flex;
      margin-top: 20px;
      align-items: center;
      justify-content: center;
      textarea {
        height: 420px;
        width: 80%;
      }
    }
    .permission {
      display: flex;
      margin-top: 10px;
      align-items: center;
      justify-content: flex-start;
      height: 25px;
      width: 100%;
      .radio {
        flex: 1;
        img {
          height: 25px;
          width: 25px;
          margin-left: 40px;
        }
      }
      .authority {
        font-size: 16px;
        color: $font-dark;
        height: 25px;
        flex: 3;
      }
    }
    .post {
      height: 42px;
      line-height: 42px;
      border-radius: 8px;
      background: $main-color;
      font-size: 18px;
      color: #ffffff;
      text-align: center;
      width: 80%;
      margin: 30px auto 0 auto;
    }
  }
  </style>
