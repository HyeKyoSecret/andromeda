<template>
  <div class="discover">
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
          <span class="default">默认</span>
        </div>
        <div>
          <span class="subscribe">关注</span>
        </div>
        <div>
          <span class="friend">好友</span>
        </div>
        <div>
          <span class="nova">新星</span>
        </div>
      </div>
    </div>
    <div class="one-recommendation">
      <div class="story-information">
        <div class="cover">
          <div><img src="../../img/photo/LegendofZelda.png" /></div>
          <div class="book-number">
            <span><img src="../../img/icon/graybook.png" /></span>
            <span class="number">4399</span>
          </div>
        </div>
        <div class="right-part">
          <div class="story-name">塞尔达传说</div>
          <div class="story-content">是非成败转头空，青山依旧在，惯看秋月春风。一壶浊酒喜相逢，古今多少事，滚滚败转头空相逢，古今多少事，滚滚败转头空……</div>
        </div>
      </div>
      <div class="assist-info">
        <div class="reason">
          推送理由：来自好友2B
        </div>
        <div class="author-info">
          <div class="author-name">作者：林克</div>
          <div class="time">2017.10.14 19:37</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .discover {
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
        justify-content: space-between;
        .default {
          border: 2px solid $dark-green;
          line-height: 22px;
        }
        .subscribe {
          border: 2px solid $dark-red;
          line-height: 22px;
        }
        .friend {
          border: 2px solid $dark-blue;
          line-height: 22px;
        }
        .nova {
          border: 2px solid $dark-yellow;
          line-height: 22px;
        }
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
            border-radius: 5px;
            box-sizing: border-box;
          }
          .default {
            background: $main-color;
          }
          .subscribe {
            background: $icon-red;
          }
          .friend {
            background: $icon-blue;
          }
          .nova {
            background: $icon-yellow;
          }
        }
      }
    }
    .one-recommendation {
      height: 140px;
      width: 100%;
      background-color: white;
      margin-top: 25px;
      .story-information {
        margin-left: 10px;
        margin-right: 10px;
        height: 100px;
        display: flex;
        align-items:flex-start;
        .cover {
          margin-top: 10px;
            img {
              height: 80px;
              width: 60px;
          }
          .book-number {
            height: 18px;
            img{
              height: 15px;
              width: 15px;
              margin-left: 5px;
            }
            .number {
              position: relative;
              top: -5px;
              margin-left: 3px;
              vertical-align: middle;
              color: $font-dark;
              font-size: 12px;
            }
          }
        }
        .right-part {
          margin-left: 10px;
          margin-top: 8px;
          .story-name {
            color: $font-dark;
            font-size: 15px;
            font-weight: 600;
          }
          .story-content {
            margin-top: 3px;
            color: $font-dark;
            font-size: 14px;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            -moz-box-orient: vertical;
            -moz-line-clamp: 3;
            overflow: hidden;
          }
        }
      }
      .assist-info {
        display: flex;
        align-items: center;
        margin-left: 10px;
        margin-right: 10px;
        .reason {
          color: $font-gray;
          font-size: 12px;
          flex:1;
        }
        .author-info {
          text-align: right;
          flex: 1;
          font-size: 12px;
          color: $font-gray;
        }
      }
    }
  }
</style>
