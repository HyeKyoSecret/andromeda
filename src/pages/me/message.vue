<template>
  <div class="message">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        我的消息
      </span>
    </div>
    <div class="button-bar">
      <div class="button">
        <div>
          <router-link tag='span' to='/me/message/words' class="words">留言</router-link>
        </div>
        <div>
          <router-link tag='span' to='/me/message/request' class="request">请求</router-link>
        </div>
        <div>
          <router-link tag='span' to='/me/message/promote' class="promote">提示</router-link>
        </div>
        <div>
          <router-link tag='span' to='/me/message/announcement' class="announcement">公告</router-link>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <!--<div class="promote-template">-->
      <!--<div class="content">-->
        <!--<div class="user">SongHyeKyo</div>-->
        <!--<div class="content-zan">赞了您在<a>萨尔达传说</a>中的创作</div>-->
        <!--&lt;!&ndash;<div class="content-focus">关注了您</div>&ndash;&gt;-->
        <!--<div class="time">2017-11-5</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class="word-template">-->
      <!--<div class="content">-->
        <!--<div class="left">-->
          <!--<img src='../../img/photo/head.jpg'>-->
        <!--</div>-->
        <!--<div class="right">-->
          <!--<div class="name">HyeKyo</div>-->
          <!--<div class="words">-->
            <!--有时候恍惚觉得你还是那个二十四五岁的少年唱着咬字不清的歌曲 话少羞涩才气四溢 对着演唱会台下的无数歌迷朋友想了又想只能说出“其实不知道该说些什么...我会尽力的表演谢谢你们”背带裤只系一-->
          <!--</div>-->
          <!--<div class="time">2017-11-5</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class="request-template">-->
      <!--<div class="rq-content">-->
        <!--<mt-cell-swipe class='rq'-->
                       <!--title="HyeKyo"-->
                       <!--:right="[-->
          <!--{-->
            <!--content: '删除',-->
            <!--style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'}-->
          <!--}-->
        <!--]">-->
          <!--<slot>-->
            <!--<div class='add-request'>-->
              <!--<span>请求添加您为好友</span>-->
              <!--<span>2017-12-12 18:54</span>-->
              <!--<span class='pass-btn'>通过</span>-->
            <!--</div>-->
          <!--</slot>-->
        <!--</mt-cell-swipe>-->
      <!--</div>-->
      <!--<div class="rq-content">-->
        <!--<mt-cell-swipe class='rq'-->
                       <!--title="千里不留行"-->
                       <!--:right="[-->
          <!--{-->
            <!--content: '删除',-->
            <!--style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'}-->
          <!--}-->
        <!--]">-->
          <!--<slot>-->
            <!--<div class='add-request'>-->
              <!--<span>请求添加您为好友</span>-->
              <!--<span>2017-12-12 16:06</span>-->
              <!--<span class='pass-btn'>通过</span>-->
            <!--</div>-->
          <!--</slot>-->
        <!--</mt-cell-swipe>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class="announcement-template">-->
      <!--<div class="content">-->
        <!--<div class="left">-->
          <!--<img src="../../img/photo/head.jpg">-->
        <!--</div>-->
        <!--<div class="right">-->
          <!--<div class="word">路上只我一个人，背着手踱⑶着。这一片天地好像是我的；我也像超出了平常的自己，到了另一个世界里。我爱热闹，也爱冷静；爱群居，也爱独处。像今晚上，一个人在这苍茫的月下，什么都可以想，什么都可以不想，便觉是个自由的人。白天里一定要做的事，一定要说的话，现 在都可不理。这是独处的妙处，我且受用这无边的荷香月色好了。</div>-->
          <!--<a href='/'>查看更多>></a>-->
          <!--<div class="date">2017-12-2 14:25</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="content">-->
        <!--<div class="left">-->
          <!--<img src="../../img/photo/head.jpg">-->
        <!--</div>-->
        <!--<div class="right">-->
          <!--<div class="word">路上只我一个人，背着手踱⑶着。这一片天地好像是我的；我也像超出了平常的自己，到了另一个世界里。我爱热闹，也爱冷静；爱群居，也爱独处。像今晚上，一个人在这苍茫的月下，什么都可以想，什么都可以不想，便觉是个自由的人。白天里一定要做的事，一定要说的话，现 在都可不理。这是独处的妙处，我且受用这无边的荷香月色好了。</div>-->
          <!--<a href='/'>查看更多>></a>-->
          <!--<div class="date">2017-12-2 14:25</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
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
  .message {
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
      span{
        text-align: center;
        font-size: 16px;
      }
      img {
        position: absolute;
        top: 10px;
        left: 11px;
        width: 12px;
        height: 20px;
      }
    }
    .button-bar {
      width: 100%;
      background: white;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .button {
        width: 90%;
        height: 26px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          flex: 1;
          height: 26px;
          width: 30px;
          text-align: center;
          line-height: 26px;
          span {
            display: inline-block;
            width: 48px;
            height: 26px;
            background: red;
            color: white;
          }
          .words {
            background: $main-color;
          }
          .request {
            background: $icon-red;
          }
          .promote {
            background: $icon-blue;
          }
          .announcement {
            background: $icon-yellow;
          }
        }
      }
    }
  }
</style>
