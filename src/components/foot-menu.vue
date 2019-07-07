<template>
  <div class="foot-menu">
    <router-link tag='div' to= '/start' class="button" @click="closeError">
      <div class="f-begin pic"></div>
      <div class="words">开始</div>
    </router-link>
    <div class="discovery">
      <router-link tag='div' class="circle" to='/discover/selected' @click="closeError" :class="{'router-link-active': discoverPath, 'router-link-exact-active': discoverPath}">
        <div class="f-discover"></div>
      </router-link>
    </div>
    <router-link tag ='div' class="button" to='/people' @click="closeError">
      <div class="n-me" v-if="existNewMessage"></div>
      <div class="f-me pic" v-else></div>
      <div class="words">我</div>
      <div class="new-info"></div>
    </router-link>
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
  @import "../scss/config";
  .foot-menu {
    width: 100%;
    height: 48px;
    background: white;
    position: fixed;
    z-index: 998;
    bottom: 0;
    display: flex;
    color: $menu-color;
    .words {
      margin-top: -5px;
    }
    .pic {
      height: 35px;
      background-repeat: no-repeat;
      background-size: 23px 23px;
      background-position:center;
    }
    .n-me {
      height: 35px;
      background-repeat: no-repeat;
      background-size: 25px 25px;
      background-position:center;
      background-image: url(../img/icon/me_news_unactivated.png);
      margin-left: 2px;
    }
    .router-link-active .n-me {
      height: 35px;
      background-repeat: no-repeat;
      background-size: 25px 25px;
      background-position:center;
      background-image: url(../img/icon/me_news_activated.png);
      margin-left: 3px;
    }
    .n-me {
      height: 35px;
      background-repeat: no-repeat;
      background-size: 25px 25px;
      background-position:center;
      background-image: url(../img/icon/me_news_unactivated.png);
    }
    .f-begin {
      background-image: url(../img/icon/foot_begin.png);
    }
    .f-me {
      background-image: url(../img/icon/foot_me.png);
    }
    .router-link-active .f-me {
      background-image: url(../img/icon/foot_me_active.png);
    }
    .f-discover {
      height: 65px;
      margin-left: -4px;
      background-image: url(../img/icon/foot_discovery.png);
      background-repeat: no-repeat;
      background-size: 55px 45px;
      background-position:center;
    }
    .router-link-active .f-begin {
      background-image: url(../img/icon/foot_begin_active.png);
    }
    .router-link-active .f-discover {
      height: 65px;
      margin-left: -4px;
      background-image: url(../img/icon/foot_discovery_active.png);
      background-repeat: no-repeat;
      background-size: 55px 45px;
      background-position:center;
    }
    .button{
      flex: 1;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      text-align: center;
      font-size: 12px;
    }
    .discovery {
      flex: 2;
      .circle{
        width: 86px;
        height: 43px;
        background: white;
        border-radius: 1000px 1000px 0 0;
        position: absolute;
        top: -24px;
        left: 50%;
        margin-left: -43px;
      }
    }
  }
</style>
<script>
  import Axios from 'axios'
  export default {
    name: 'foot-menu',
    data () {
      return {
        existNewMessage: false
      }
    },
    computed: {
      discoverPath: function () {
        let sp = this.$route.path.split('/')
        return sp[sp.length - 1] === 'focus' || sp[sp.length - 1] === 'friend'
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData () {
        Axios.get('/user/getNewState')
          .then(response => {
            if (!response.data.error) {
              let doc = response.data.result
              this.existNewMessage = (doc.words || doc.promote || doc.announcement || doc.request)
            }
          })
      },
      closeError () {
        this.$emit('close')
      }
    }
  }
</script>
