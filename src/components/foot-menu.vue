<template>
  <div class="foot-menu">
    <router-link tag='div' to= '/begin' class="button">
      <img src="../img/icon/foot_begin.png">
      <div>开始</div>
    </router-link>
    <div class="discovery">
      <router-link tag='div'  to='/discovery'><img src="../img/icon/foot_discovery.png"></router-link>
    </div>
    <router-link tag ='div' class="button" to='/me'>
      <img src="../img/icon/foot_me.png">
      <div>我</div>
    </router-link>
  </div>
</template>
<style lang="scss" scoped>
  @import "../scss/config";
  .foot-menu {
    width: 100%;
    height: 48px;
    background: white;
    position: fixed;
    bottom: 0;
    margin: auto;
    display: flex;
    color: $menu-color;
    .button{
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
    .discovery {
      flex: 2;
      div{
        width: 86px;
        height: 86px;
        background: white;
        border-radius: 1000px;
        position: absolute;
        top: -24px;
        left: 50%;
        margin-left: -43px;
      }
      img {
        position: absolute;
        left: 50%;
        top: 12px;
        width: 55px;
        height: 41px;
        margin-left: -30px; // 图标多补1px
      }
    }
  }
</style>
<script>
  export default {
    name: 'foot-menu'
  }
</script>
