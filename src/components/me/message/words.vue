<template>
  <div class="word-template" v-swipe="{methods: swipe}">
    <div class="content">
      <div class="left">
        <img src='../../../img/photo/head.jpg'>
      </div>
      <div class="right">
        <div class="name">HyeKyo</div>
        <div class="words">
          有时候恍惚觉得你还是那个二十四五岁的少年唱着咬字不清的歌曲 话少羞涩才气四溢 对着演唱会台下的无数歌迷朋友想了又想只能说出“其实不知道该说些什么...我会尽力的表演谢谢你们”背带裤只系一
        </div>
        <div class="time">2017-11-5</div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .word-template {
    height: 100%;
    width: 100%;
    margin-top: 20px;
    .content {
      min-height: 100px;
      margin-bottom: 20px;
      background: white;
      display: flex;
      align-items: center;
      &:last-child {
        margin-bottom: 60px;
      }
      .left {
        flex: 1;
        height: 100%;
        img {
          width: 70px;
          height: 70px;
          border-radius: 5px;
          margin-left: 12px;
        }
      }
      .right {
        margin-left: 20px;
        .name {
          color: $icon-blue;
          font-size: 14px;
          font-weight: 600;
        }
        .words {
          margin-right: 12px;
          margin-top: 5px;
          display: -webkit-box;
          display: -moz-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          -moz-box-orient: vertical;
          -moz-line-clamp: 2;
          overflow: hidden;
          font-size: 13px;
        }
        .time {
          text-align: right;
          color: $font-color;
          font-size: 14px;
          margin-right: 12px;
          margin-top: 7px;
        }
      }
    }
  }
</style>
<script>
  export default {
    name: 'words',
    methods: {
      swipe (e) {
        if (e.direction === 'Left') {
          this.$router.push({name: 'message_request'})
        }
      }
    }
  }
</script>
