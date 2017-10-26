<template>
  <div class="marker">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        书签
      </span>
    </div>
    <div class="one-marker">
      <div class="icon"><img src="../../img/icon/marker_selected.png" /></div>
      <div class="marker-info">
        <div class="story-info">
          <div class="content">是非成败转头空，青山依旧在，惯看秋月春风。一壶浊酒喜相逢，古今多少事，滚滚长江东逝水，浪花淘尽英雄。 几度夕阳红。白发渔樵江渚上，都付笑谈中。滚滚长江东逝水，浪花淘尽英雄。是非成败转头空</div>
          <div class="author-name">作者：林克</div>
          <div class="time">2017.10.14 19:37</div>
        </div>
        <div class="time-depth">
          <div>添加时间</div>
          <div>2017.5.27</div>
          <div class="depth">深度</div>
          <div>101</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .marker {
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
      .icon {
        position: absolute;
        left: 8px;
        display: inline-block;
        height: 42px;
        width: 30px;
        line-height: 50px;
        img {
          width: 12px;
          height: 20px;
        }
      }
    }
    .one-marker {
      margin-top: 20px;
      width: 100%;
      background-color: white;
      height:120px;
      .icon {
        position: relative;
        left: 90%;
        img {
          height: 25px;
          width: 15px;
        }
      }
      .marker-info {
        display: flex;
        .story-info {
          margin-left: 10px;
          flex: 3;
          .content{
            margin-top: -15px;
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
          .author-name {
            margin-top: 10px;
            margin-right: 15px;
            text-align: right;
            color: $font-gray;
            font-size: 12px;
          }
          .time {
            text-align: right;
            color: $font-gray;
            font-size: 12px;
            margin-right: 15px;
          }
        }
        .time-depth {
          flex: 1;
          text-align: center;
          color: $font-dark;
          .depth {
            margin-top: 5px;
          }
        }
      }
    }
  }
  </style>
