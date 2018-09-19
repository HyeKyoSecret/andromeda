<template>
  <div class="announcement-template">
    <div class="content">
      <div class="left">
        <img src="../../../img/photo/head.jpg">
      </div>
      <div class="right">
        <div class="word">路上只我一个人，背着手踱⑶着。这一片天地好像是我的；我也像超出了平常的自己，到了另一个世界里。我爱热闹，也爱冷静；爱群居，也爱独处。像今晚上，一个人在这苍茫的月下，什么都可以想，什么都可以不想，便觉是个自由的人。白天里一定要做的事，一定要说的话，现 在都可不理。这是独处的妙处，我且受用这无边的荷香月色好了。</div>
        <a href='/'>查看更多>></a>
        <div class="date">2017-12-2 14:25</div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <img src="../../../img/photo/head.jpg">
      </div>
      <div class="right">
        <div class="word">路上只我一个人，背着手踱⑶着。这一片天地好像是我的；我也像超出了平常的自己，到了另一个世界里。我爱热闹，也爱冷静；爱群居，也爱独处。像今晚上，一个人在这苍茫的月下，什么都可以想，什么都可以不想，便觉是个自由的人。白天里一定要做的事，一定要说的话，现 在都可不理。这是独处的妙处，我且受用这无边的荷香月色好了。</div>
        <a href='/'>查看更多>></a>
        <div class="date">2017-12-2 14:25</div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .announcement-template {
    width: 100%;
    min-height: calc(100vh - 82px);
    .content {
      display: flex;
      margin-top: 20px;
      min-height: 100px;
      background: #ffffff;
      &:last-child {
        margin-bottom: 60px;
      }
      .left {
        flex: 1;
        margin-left: 8px;
        text-align: center;
        display: flex;
        align-items: center;
        img {
          width: 80px;
          height: 80px;
        }
      }
      .right {
        margin-left: 15px;
        .word {
          display: -webkit-box;
          display: -moz-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          -moz-box-orient: vertical;
          -moz-line-clamp: 3;
          overflow: hidden;
          font-size: 13px;
          margin-left: 5px;
          margin-right: 10px;
          margin-top: 9px;
        }
        .date {
          float: right;
          margin-top: 12px;
          display: inline-block;
          margin-right: 20px;
          font-size: 12px;
          color: $w-gray;
        }
        a {
          display: inline-block;
          float: right;
          margin-top: 10px;
          margin-right: 7px;
          color: $icon-blue;
        }

      }
    }
  }
</style>
<script>
  export default {
    name: 'announcement',
    methods: {
      swipe (e) {
        if (e.direction === 'Right') {
          this.$router.push({name: 'message_promote', params: { user: this.$route.params.user }})
        }
      }
    }
  }
</script>
