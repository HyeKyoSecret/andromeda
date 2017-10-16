<template>
  <div class="build-story-recommend">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        选择好友推荐
      </span>
      <span class="complete">
        完成
      </span>
    </div>
    <div class="search">
      <span class="magnifier"><img src="../../img/icon/magnifier.png" /></span>
      <span><input type="text" placeholder="搜索"></span>
    </div>
    <div class="star-friend">
      <span><img src="../../img/icon/graystar.png" /></span>
      <span>星标好友</span>
    </div>
    <div class="friend-list">
      <div class="one-friend">
        <div class="icon"><img src="../../img/icon/greenbingo.png" /></div>
        <div class="head"><img src="../../img/photo/2b_head.png" /></div>
        <div class="name">2B</div>
      </div>
      <div class="one-friend">
        <div class="icon"><img src="../../img/icon/greenbingo.png" /></div>
        <div class="head"><img src="../../img/photo/2b_head.png" /></div>
        <div class="name">2B</div>
      </div>
    </div>
    <div class="a-friend">
      <span>A</span>
    </div>
    <div class="friend-list">
      <div class="one-friend">
        <div class="icon"><img src="../../img/icon/grennbingo_unselected.png" /></div>
        <div class="head"><img src="../../img/photo/2b_head.png" /></div>
        <div class="name">2B</div>
      </div>
      <div class="one-friend">
        <div class="icon"><img src="../../img/icon/grennbingo_unselected.png" /></div>
        <div class="head"><img src="../../img/photo/2b_head.png" /></div>
        <div class="name">2B</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import "../../scss/config";
  .build-story-recommend {
    height: 100%;
    width: 100%;
    background: $bg-gray;
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
      .complete {
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
    .search {
      background-color: white;
      height: 42px;
      display: flex;
      align-items: center;
      .magnifier {
        margin-left: 10px;
        margin-right: 12px;
        img {
          height: 25px;
          width: 23px;
        }
      }
      input{
        color: #333333;
        border: none;
        outline: none;
        padding-left: 5px;
        height: 35px;
        font-size: 14px;
        overflow: hidden;
      }
    }
    .star-friend {
      display: flex;
      align-items: center;
      height: 20px;
      margin-top: 25px;
      img {
        height: 18px;
        width: 18px;
        margin-right: 10px;
        margin-left: 10px;
        font-size: 16px;
      }
      span {
        color: $w-gray;
      }
    }
    .friend-list {
      margin-top: 5px;
      .one-friend {
        background: white;
        display: flex;
        border-bottom: 1px solid $line-gray;
        height: 75px;
        width: 100%;
        align-items: center;

        .icon {
          margin-left: 10px;
          margin-right: 30px;
          img {
            height: 25px;
            width: 25px
          }
        }
        .head {
          margin-right: 25px;
          img {
            height: 45px;
            width: 45px;
          }
        }
        .name {
          color: $font-dark;
          font-size: 16px;
        }
        &:last-child {
          border: none;
        }
      }
    }
    .a-friend {
      height: 20px;
      margin-top: 25px;
      color: $w-gray;
      span {
        margin-left: 10px;
        font-size: 16px;
      }
    }
  }
  </style>
