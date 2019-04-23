<template>
  <div class="message">
    <notice title="我的消息"></notice>
    <div class="button-bar">
      <div class="button">
        <div v-for="item in btn">
          <router-link tag='span' :to='item.path' :class="item.className" replace>{{item.name}}</router-link>
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
            path: '/people/message/words'
          },
          {
            name: '请求',
            className: 'request',
            path: '/people/message/request'
          },
          {
            name: '通知',
            className: 'promote',
            path: '/people/message/promote'
          },
          {
            name: '公告',
            className: 'announcement',
            path: '/people/message/announcement'
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
    margin-top: 42px;
    min-height: calc(100vh - 84px);
    width: 100%;
    background: $bg-gray;
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
        .words.router-link-active {
          border: 2px solid $dark-green;
          color: $dark-green;
          line-height: 22px;
          font-weight: 600;
          opacity: 1;
        }
        .request.router-link-active {
          border: 2px solid $dark-red;
          color: $dark-red;
          line-height: 22px;
          font-weight: 600;
          opacity: 1;
        }
        .promote.router-link-active {
          border: 2px solid $icon-blue;
          line-height: 22px;
          color: $icon-blue;
          font-weight: 600;
          opacity: 1;
        }
        .announcement.router-link-active {
          border: 2px solid $dark-yellow;
          line-height: 22px;
          color: $dark-yellow;
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
            height: 26px;
            color: white;
            border-radius: 5px;
            box-sizing: border-box;
          }
          .words {
            color: rgb(183, 223, 178);
            font-weight: 600;
          }
          .request {
            color: rgb(242, 168, 170);
            font-weight: 600;
          }
          .promote {
            color: rgb(125, 153, 203);
            font-weight: 600;
          }
          .announcement {
            color: rgb(248, 215, 174);
            font-weight: 600;
          }
        }
      }
    }
  }
  .child-view {
    position: absolute;
    width:100%;
    transition: all .3s cubic-bezier(.35,.2,.7,1);
  }
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(380px, 0);
    transform: translate(380px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-400px, 0);
    transform: translate(-400px, 0);
  }
</style>
