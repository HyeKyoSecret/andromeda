<template>
  <div class="error">
    <notice title="错误页面"></notice>
    <div class="content">
      <img src="../../img/images/404.png" alt="">
    </div>
  </div>
</template>
<script>
  import notice from '../notice/notice.vue'
  export default {
    name: 'errorPage',
    components: {
      notice
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  .error {
    width: 100%;
    .content {
      width: 100%;
      height: calc(100vh - 42px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: $bg-gray;
      img {
        max-width: 305px;
      }
    }
  }
</style>
