<template>
  <div class="my-creation">
    <notice v-bind:title="title" class="notice-bar"></notice>
    <div class="button-bar">
      <div class="button">
        <div ><router-link :to="rootPath" class="root" :class="{'router-link-active': rootActive }" tag="span">{{rtitle}}</router-link></div>
        <div ><router-link :to="storyPath" class="story"  :class="{'router-link-active': !rootActive }" tag="span" >{{stitle}}</router-link></div>
      </div>
    </div>
    <keep-alive>
        <router-view class="child"></router-view>
    </keep-alive>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import creationRoot from '../../components/me/creation/creationRoot.vue'
  import creationStory from '../../components/me/creation/creationStory.vue'
  import notice from '../../components/notice/notice.vue'
  import Axios from 'axios'
  export default {
    name: 'creation',
    components: {
      FootMenu,
      notice,
      creationRoot,
      creationStory
    },
    data () {
      return {
        isUser: false,
        title: '我的创作',
        rtitle: '我发起的',
        stitle: '我参与的',
        myRootActive: true,
        rootPath: `/people/${this.$route.params.user}/creation/root`,
        storyPath: `/people/${this.$route.params.user}/creation/story`
      }
    },
    created: function () {
      this.confirmUser()
    },
    computed: {
      rootActive: function () {
        return this.$route.path.split('/')[this.$route.path.split('/').length - 1] === 'root'
      }
    },
    watch: {
      $route: function () {
        this.confirmUser()
      }
    },
    methods: {
      confirmUser () {
        Axios.get('/register/checkUser', {
          params: {
            user: this.$route.params.user
          }
        }).then(response => {
          if (response.data.customer) {
            this.title = response.data.sex + '的创作'
            this.rtitle = response.data.sex + '发起的'
            this.stitle = response.data.sex + '参与的'
          }
        })
      },
      refresh (type) {
        this[type] = []
        this.fetchData(type)
      },
      setErrorImg (x) {
        this.story[x].cover = require('../../img/photo/default2.png')
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .my-creation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 42px);
    overflow: hidden;
    background: $bg-gray;
    .child {
      position: absolute;
      top: 82px;
      height: calc(100vh - 130px);
      width: 100%;
      overflow-y: auto;
    }
    .notice-bar {
      position: fixed;
      top: 0;
      width: 100%;
    }
    .button-bar {
      position: fixed;
      z-index: 999;
      top: 42px;
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
          text-align: center;
          line-height: 26px;
          span {
            display: inline-block;
            width: 80px;
            height: 40px;
            color: $font-gray;
            line-height: 40px;
            box-sizing: border-box;
          }
          .router-link-active{
            color: $font-dark;
            border-bottom: 2px solid $font-dark;
          }
        }
      }
    }
    @media (min-width: 768px) {
      .notice-bar, .button-bar {
        max-width: 700px;
        .foot-menu {
          max-width: 700px;
        }
      }
    }
    .creation {
      margin-top: 90px;
    }
  }
  .mint-indicator {
    z-index: 999;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
