<template>
  <div class="my-creation-node">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        塞尔达传说
      </span>
    </div>
    <div class="open-authorized">
      开放自由编写
    </div>
<!--    <div class="already-authorized">
      已开放自由编写
    </div>-->
    <div class="one-node">
      <div class="story-information">
        <div class="cover">
          <div><img src="../../img/photo/LegendofZelda.png" /></div>
          <div class="change-cover">更换封面</div>
        </div>
        <div class="right-part">
          <div class="story-name">
            <span class="name">塞尔达传说</span>
            <span class="beginning">开头</span>
          </div>
          <div class="story-content">是非成败转头空，青山依旧在，惯看秋月春风。一壶浊酒喜相逢，古今多少事，滚滚败转头空相逢，古今多少事，滚滚败转头空今多少事，逢，古今多少事，滚滚败转头空</div>
          <div class="like-quantity">
            <span><img src="../../img/icon/gray_thumb.png" /></span>
            <span>18次</span>
          </div>
          <div class="time">2017年11月19日</div>
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
  .my-creation-node {
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
    .open-authorized {
      margin: 10px 25% 0 25%;
      background-color: $icon-red;
      height: 30px;
      color: white;
      text-align: center;
      line-height:30px;
      border-radius: 5px;
      font-size:16px;
    }
    .already-authorized {
      margin: 10px 25% 0 25%;
      background-color: $main-color;
      height: 30px;
      color: white;
      text-align: center;
      line-height:30px;
      border-radius: 5px;
      font-size:16px;
    }
    .one-node {
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
          .change-cover {
            height: 20px;
            width: 75px;
            margin: 10px 5px 0 -4px;
            background-color: $main-color;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            text-align: center;
            line-height: 20px;
          }
        }
        .right-part {
          margin-top: 8px;
          flex: 3;
          .story-name {
            color: $font-dark;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            .name {
              flex:3;
              text-align: left;
            }
            .beginning {
              margin-left: 50px;
              flex: 1;
              text-align: center;
              height: 20px;
              border:1px solid $icon-red;
              border-radius: 5px;
              font-size: 14px;
              color: $icon-red;
              font-weight: normal;
            }
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
          .like-quantity  {
            text-align: right;
            font-size: 14px;
            color: $font-gray;
            margin-top: 10px;
            img {
              height: 14px;
              width: 14px;
              vertical-align: center;
            }
          }
          .time {
            text-align: right;
            font-size: 14px;
            color: $font-gray;
          }
        }
      }
    }
  }
</style>
