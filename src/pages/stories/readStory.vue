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
    </div>
    <div class="related-info">
      <div class="anchor"><img src="../../img/icon/anchor.png" /></div>
      <div class="author-info">
        <div class="like">
          <span >作者:林克</span>
          <span ><img src="../../img/icon/redheart.png" /></span>
        </div>
        <div class="time">2017.10.14 19:37</div>
        <div class="follow-number">
          <span class="tri"><img src="../../img/icon/triangle_downward.png"/></span>
          <span class="number">1563</span>
        </div>
      </div>
    </div>
    <div class="read-foot-menu">
      <div class="button">
        <img src="../../img/icon/yellowthumb.png" />
        <div>赞</div>
        <!--<div>10</div>-->
      </div>
      <div class="button">
        <img src="../../img/icon/yellowstar.png" />
        <div>订阅</div>
      </div>
      <div class="write-continue">
        <div><img src="../../img/icon/writecontinue.png" /></div>
      </div>
      <div class="button">
        <img src="../../img/icon/yellowcomment.png" />
        <div>评论</div>
      </div>
      <div class="button">
        <img src="../../img/icon/yellowjump.png" />
        <div>智能跳转</div>
      </div>
    </div>
    <div class="jump-menu">
      <div class="button">刚才阅读</div>
      <div class="button">最浅未读</div>
      <div class="button">最深以读</div>
      <div class="button">开头</div>
      <div class="button">锚定节点</div>
      <div class="button">热门节点</div>
      <div class="button">书签</div>
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
      height: 320px;
      color: $font-dark;
    }
    .related-info {
      display: flex;
      margin-top: 5px;
      justify-content: space-between;
      .anchor {
        flex: 2;
        flex-grow: 0;
        margin-left: 5%;
        width: 100px;
        img {
          height: 50px;
          width: 50px;
        }
      }
      .author-info {
        flex: 1;
        text-align: right;
        margin-right: 15px;
        .like {
          span{
            img {
              height: 25px;
              width: 25px;
              margin-left: 5px;
              vertical-align: middle;
            }
            color: $font-gray;
            font-size: 16px;
            text-align: right;

          }

        }
        .time {
          font-size: 12px;
          color: $font-gray;
          margin-top: 5px;
          margin-right: 15px;
        }
        .follow-number {
          color: $font-gray;
          font-size: 15px;
          text-align: right;
          margin-top: 25px;
          margin-right: 20px;
          img {
            height: 15px;
            width: 15px;
            margin-right: 5px;
            vertical-align: middle;
          }
        }

      }
    }
    .read-foot-menu {
      width: 100%;
      height: 48px;
      background: white;
      position: absolute;
      bottom: 0;
      display: flex;
      color: $menu-color;
      .button {
        flex: 1;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        text-align: center;
        img {
          margin: 4px auto 0 auto;
          width: 23px;
          height: 23px;
        }
        font-size: 12px;
      }
      .write-continue {
        flex: 2;
        div {
          width: 86px;
          height: 43px;
          background: white;
          border-radius: 1000px 1000px 0 0 ;
          position: absolute;
          top: -24px;
          left: 50%;
          margin-left: -43px;
        }
        img {
          position: absolute;
          left: 50%;
          top: 8px;
          width: 65px;
          height: 57px;
          margin-left: -40px;
        }
      }
    }
    .jump-menu {
      position: absolute;
      top: 120px;
      left: 50%;
      width: 240px;
      background-color: white;
      margin-left: -120px;
      border-radius: 8px;
      color: $font-dark;
      border: 1px solid $border-gray;
      .button {
        text-align: center;
        font-size: 18px;
        height: 45px;
        line-height: 45px;

        border-bottom: 1px solid $line-gray;
        &:last-child {
          border:  none;
        }
      }

    }
  }
  </style>
