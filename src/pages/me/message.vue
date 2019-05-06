<template>
  <div class="message">
    <notice title="我的消息"></notice>
    <div class="button-bar">
      <div class="button">
        <div v-for="(item,index) in btn">
          <router-link tag='span' :to='item.path' :class="item.className" replace>{{item.name}}</router-link>
          <span class="newNum" :style="{left: 12.5 * (2*index + 1) + '%'}">{{item.newNum}}</span>
        </div>
      </div>
    </div>
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import notice from '../../components/notice/notice.vue'
  import FootMenu from '../../components/foot-menu.vue'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        router: ['message_words', 'message_request', 'message_promote', 'message_announcement'],
        btn: [
          {
            name: '留言',
            className: 'words',
            path: '/people/message/words',
            newNum: 1
          },
          {
            name: '请求',
            className: 'request',
            path: '/people/message/request',
            newNum: 2
          },
          {
            name: '通知',
            className: 'promote',
            path: '/people/message/promote',
            newNum: 3
          },
          {
            name: '公告',
            className: 'announcement',
            path: '/people/message/announcement',
            newNum: 4
          }
        ],
        transitionName: 'slide-left'
      }
    },
    components: {
      notice,
      FootMenu
    },
    created: function () {
      this.getUserData()
    },
    watch: {
      '$route': function (to, from) {
        let toPage = to.name
        let fromPage = from.name
        let toPageIndex = ''
        let fromPageIndex = ''
        for (let i = 0; i < 4; i++) {
          if (toPage === this.router[i]) {
            toPageIndex = i
          }
          if (fromPage === this.router[i]) {
            fromPageIndex = i
          }
        }
        this.transitionName = toPageIndex > fromPageIndex ? 'slide-left' : 'slide-right'
      }
    },
    methods: {
      getUserData () {
        Axios.get('/user/getMessageData')
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              for (let i = 0; i < this.btn.length; i++) { // 修改path
                let pathArray = this.btn[i].path.split('/people')
                this.btn[i].path = `/people/${response.data.user}${pathArray[1]}`
              }
            }
          })
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  .message {
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 42px;
    min-height: calc(100vh - 42px);
    width: 100%;
    background: $bg-gray;
    overflow: scroll;
    .button-bar {
      z-index: 999;
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
        justify-content: center;
        .newNum {
          display: inline-block;
          color: white;
          background: $main-red;
          opacity: 0.85;
          font-size: 12px;
          width: 16px;
          height: 16px;
          line-height: 16px;
          border-radius: 200px;
          position: absolute;
          top: 5px;
          margin-left: 13px;
        }
        .words.router-link-active {
          border-bottom: 2px solid $font-dark;
          color: $font-dark;
          line-height: 22px;
          font-weight: 600;
          opacity: 1;
        }
        .request.router-link-active {
          border-bottom: 2px solid $font-dark;
          color: $font-dark;
          line-height: 22px;
          font-weight: 600;
          opacity: 1;
        }
        .promote.router-link-active {
          border-bottom: 2px solid $font-dark;
          line-height: 22px;
          color: $font-dark;
          font-weight: 600;
          opacity: 1;
        }
        .announcement.router-link-active {
          border-bottom: 2px solid $font-dark;
          line-height: 22px;
          color: $font-dark;
          font-weight: 600;
          opacity: 1;
        }
        div {
          flex: 1;
          height: 26px;
          width: 30px;
          text-align: center;
          line-height: 22px;
          span {
            display: inline-block;
            width: 48px;
            height: 33px;
            box-sizing: border-box;
            color: $w-gray;
            font-weight: 600;
          }
        }
      }
    }
  }
  .child-view {
    position: absolute;
    z-index: 200;
    width:100%;
    transition: all .3s cubic-bezier(.35,.2,.7,1);
  }
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  @media (min-width: 768px) {
    .button-bar {
      max-width: 700px;
    }
  }
</style>
