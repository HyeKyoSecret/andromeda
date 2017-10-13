<template>
  <div class="read-story">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        塞尔达传说
      </span>
    </div>
    <div class="marker">
      <img src="../../img/icon/marker_selected.png" />
    </div>
    <div class="context">
      是非成败转头空，青山依旧在，惯看秋月春风。一壶浊酒喜相逢，古今多少事，滚滚长江东逝水，浪花淘尽英雄。 几度夕阳红。白发渔樵江渚上，都付笑谈中。
      滚滚长江东逝水，浪花淘尽英雄。是非成败转头空，青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢，古今多少事，都付笑谈中。
      ，浪花一壶浊酒喜相逢，古今多少事，滚滚长江东逝水，浪花淘尽英雄。 几度夕阳红。白发渔樵江渚上，都付笑谈中。
      滚滚长江东逝水，浪花淘尽英雄。是非成败转头空，青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢，古今多少事，都付笑谈中。
      滚滚长江东逝水，浪花淘尽英雄。是非成败转头空，青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢，古今多少事，都付笑谈中。
    </div>
    <div class="related-info">
      <div class="anchor"><img src="../../img/icon/anchor.png" /></div>
      <div class="author-info">
        <div>
          <span class="author-name">作者:林克</span>
          <span class="like"><img src="../../img/icon/redheart.png" /></span>
        </div>
        <div class="time">2017.10.14 19:37</div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
  .read-story {
    height: 100%;
    background: $bg-gray;
    .notice {
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
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
    .marker {
      float: right;
      margin-right: 30px;
      margin-top: -15px;
      img {
        height: 45px;
        width: 25px;
      }
    }
    .context {
      margin: 50px 10px 0 10px;
      font-size: 16px;
      height: 380px;
    }
    .related-info {
      display: flex;
    }
  }
  </style>
