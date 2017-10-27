<template>
  <div class="discover">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        搜索
      </span>
    </div>
    <div class="button-bar">
      <div class="button">
        <div>
          <span class="author">作者</span>
        </div>
        <div>
          <span class="name">题目</span>
        </div>
        <div>
          <span class="content">内容</span>
        </div>
      </div>
    </div>
    <div class="search-bar">
      <span><img src="../../img/icon/gray-magnifier.png" /></span>
      <span><input type="text" placeholder="搜索"></span>
    </div>
    <div class="order">
      <div class="inside-box">
        <div class="sort-reason">按时间排序</div>
        <div class="sort-reason">按热度排序</div>
        <div class="sort-reason">按订阅数排序</div>
      </div>
    </div>
    <div class="one-search">
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
          <div class="story-content">是非成败转头空，青山依旧在，惯看秋月春风。一壶浊酒喜相逢，古今多少事，滚滚败转头空相逢，一壶浊酒喜相逢，古今多少事，滚滚败转头空相逢古今多少事，滚滚败转头空……</div>
        </div>
      </div>
      <div class="assist-info">
        <div class="author-info">
          <div class="author-name">作者：林克</div>
          <div class="time">2017.10.14 19:37</div>
        </div>
      </div>
    </div>
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
        .author {
          border: 2px solid $dark-red;
          line-height: 22px;
        }
        .name {
          border: 2px solid $dark-blue;
          line-height: 22px;
        }
        .content {
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
          .author {
            background: $icon-red;
          }
          .name {
            background: $icon-blue;
          }
          .content {
            background: $icon-yellow;
          }
        }
      }
    }
    .search-bar {
      background-color: white;
      border-top: 1px solid $line-gray;
      border-bottom:1px solid $line-gray;
      height: 40px;
      input {
        line-height: 25px;
        border: none;
        font-size: 15px;
        vertical-align: middle;
        margin-top: 6px;
        margin-left: 10px;
        outline:none;
        color: $font-dark;
      }
      img {
        height: 22px;
        width: 20px;
        vertical-align: middle;
        margin-top: 7px;
        margin-left: 12px;
      }
    }
    .order {
      height:40px;
      background-color: white;
      .inside-box {
        display: flex;
        .sort-reason {
          flex: 1;
          margin-top: 10px;
          text-align: center;
          vertical-align: middle;
          height: 16px;
          line-height: 16px;
          border-right: 1px solid $line-gray;
          color: $font-gray;
          &:last-child {
            border:none;
          }
        }
      }
    }
    .one-search {
      height: 145px;
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
          flex: 1;
          img {
            height: 88px;
            width: 66px;
          }
          .book-number {
            height: 18px;
            img{
              height: 15px;
              width: 15px;
              margin-left: 5px;
              vertical-align: text-bottom;
            }
            .number {
              margin-left: 3px;
              color: $font-gray;
              font-size: 12px;
            }
          }
        }
        .right-part {
          margin-left: 10px;
          margin-top: 8px;
          flex: 3;
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
        margin-top: 10px;
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
