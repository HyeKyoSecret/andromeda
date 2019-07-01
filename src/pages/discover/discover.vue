<template>
  <div class="discover">
    <notice title='发现'></notice>
    <div class="button-bar">
      <div class="button">
        <div><router-link tag="span" class="default" to="/discover/selected" replace>精选</router-link></div>
        <div><router-link tag="span" class="default" to="/discover/friend" replace>好友</router-link></div>
        <div><router-link tag="span" class="default" to="/discover/focus" replace>关注</router-link></div>
        <!--<div><router-link tag="span" class="default" to="/discover/fresh" replace>新星</router-link></div>-->
      </div>
    </div>
    <keep-alive>
      <router-view class="child"></router-view>
    </keep-alive>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import notice from '../../components/notice/notice.vue'
  export default {
    components: {
      FootMenu,
      notice
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
    width: 100%;
    min-height: calc(100vh - 42px);
    box-sizing: border-box;
    background: $bg-gray;
    margin-top: 42px;
    .button-bar {
      z-index: 996;
      width: 100%;
      position: fixed;
      top: 42px;
      background: white;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .button {
        width: 100%;
        height: 26px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .default {
          line-height: 22px;
        }
        .subscribe {
          line-height: 22px;
        }
        .friend {
          line-height: 22px;
        }
        .nova {
          line-height: 22px;
        }
        div {
          flex: 1;
          height: 40px;
          text-align: center;
          line-height: 40px;
          span {
            display: inline-block;
            width: 70px;
            height: 32px;
            color: $w-gray;
            box-sizing: border-box;
          }
        }
      }
    }
    .child {
      margin-top: 50px;
    }
    .router-link-active {
      border-bottom: 2px solid $font-dark;
      color: $font-dark;
      line-height: 22px;
      font-weight: 600;
      opacity: 1;
    }
  }
  @media (min-width: 768px) {
    .button-bar {
      max-width: 700px;
    }
  }
</style>
