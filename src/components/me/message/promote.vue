<template>
  <div class="promote-template" v-swipe="{methods: swipe}">
    <div class="content">
      <div class="user">SongHyeKyo</div>
      <div class="content-zan">赞了您在<a>萨尔达传说</a>中的创作</div>
      <!--<div class="content-focus">关注了您</div>-->
      <div class="time">2017-11-5</div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .promote-template {
    margin-top: 20px;
    width: 100%;
    height: 100%;
    .content {
      width: 100%;
      background: white;
      display: flex;
      align-items: center;
      height: 50px;
      border-bottom: 1px solid $border-gray;
      &:last-child {
        border: none;
      }
      .user {
        flex: 1;
        color: $icon-blue;
        font-size: 14px;
        font-weight: 600;
        margin-left: 5px;
      }
      .content-zan, .content-focus {
        flex: 3;
        font-size: 14px;
        margin-left: 10px;
        text-align: left;
        a {
          color: $icon-blue;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .time {
        flex: 1;
        color: $font-color;
        font-size: 12px;
        text-align: right;
        margin-right: 5px;
      }
    }
  }
</style>
<script>
  export default {
    name: 'promote',
    methods: {
      swipe (e) {
        if (e.direction === 'Left') {
          this.$router.push({name: 'message_announcement'})
        } else if (e.direction === 'Right') {
          this.$router.push({name: 'message_request'})
        }
      }
    }
  }
</script>
