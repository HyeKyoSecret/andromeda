<template>
  <div class="notice">
    <span class="icon" @click="goBack">
      <img src="../../img/icon/back.png">
    </span>
    <span class="title">
      {{title}}
    </span>
  </div>
</template>
<script>
  export default {
    props: ['title'],
    methods: {
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
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
      left: 4px;
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
</style>
