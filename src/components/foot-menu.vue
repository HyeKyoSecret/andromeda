<template>
  <div class="foot-menu">
    <div class="button">
      <img src="../img/icon/foot_begin.png">
      <div>开始</div>
    </div>
    <div class="discovery">
      <img src="../img/icon/foot_discovery.png">
    </div>
    <div class="button">
      <img src="../img/icon/foot_me.png">
      <div>我</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import "../scss/config";
  .foot-menu {
    width: 100%;
    height: 46px;
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
        width: 21px;
        height: 21px;
      }
      font-size: 12px;
    }
    .discovery {
      flex: 2;
      img {
        position: absolute;
        top: -13px;
        left: 50%;
        width: 58px;
        height: 44px;
        margin-left: -29px;
      }
    }
  }
</style>
<script>
  export default {
    name: 'foot-menu'
  }
</script>
