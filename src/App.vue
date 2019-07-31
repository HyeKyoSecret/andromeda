<template>
  <div id="app" :style="{'height': scroll + 'px'}">
    <transition :enter-active-class="enterTransition"
                :leave-active-class="leaveTransition"
                mode="out-in"
                duration="300">
      <keep-alive>
        <router-view v-on:error="closeSelf" v-if="!errorPage && $route.meta.keepAlive" :key="key"
                     v-on:slideLeft="slideLeft"
                     v-on:slideRight="slideRight"
                     v-on:slideUp="slideUp"
                     v-on:slideDown="slideDown"></router-view>
      </keep-alive>
    </transition>
    <transition :enter-active-class="enterTransition"
                :leave-active-class="leaveTransition"
                mode="out-in"
                duration="300">
      <router-view v-on:error="closeSelf" v-if="!errorPage && !$route.meta.keepAlive" :key="key"
                   v-on:slideLeft="slideLeft"
                   v-on:slideRight="slideRight"
                   v-on:slideUp="slideUp"
                   v-on:slideDown="slideDown"></router-view>
    </transition>
    <ErrorPage v-if="errorPage" v-on:close="closeSelf"></ErrorPage>
  </div>
</template>
<script>
  // import FastClick from 'fastclick'
  import ErrorPage from './components/error/errorPage.vue'
  export default {
    name: 'app',
    data () {
      return {
        errorPage: false,
        scroll: window.innerHeight,
        enterTransition: 'animated fadeIn',
        leaveTransition: 'animated fadeOut'
      }
    },
    components: {
      ErrorPage
    },
    computed: {
      key () {
        return this.$route.fullPath
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.name !== 'story') {
          this.enterTransition = 'animated fadeIn'
          this.leaveTransition = 'animated fadeOut'
        }
      }
    },
    methods: {
      closeSelf () {
        this.errorPage = true
      },
      getHeight () {
        this.scroll = window.innerHeight
      },
      slideLeft () {
        console.log('slideLeft')
        this.enterTransition = 'animated slideInRight'
        this.leaveTransition = 'animated slideOutLeft'
      },
      slideRight () {
        console.log('slideRight')
        this.enterTransition = 'animated slideInLeft'
        this.leaveTransition = 'animated slideOutRight'
      },
      slideUp () {
        console.log('slideUp')
        this.enterTransition = 'animated slideInUp'
        this.leaveTransition = 'animated slideOutUp'
      },
      slideDown () {
        console.log('slideDown')
        this.enterTransition = 'animated slideInDown'
        this.leaveTransition = 'animated slideOutDown'
      }
    },
    // created: function () {
    //   document.addEventListener('DOMContentLoaded', function () {
    //     FastClick.attach(document.body)
    //   }, false)
    // },
    mounted () {
      window.addEventListener('resize', this.getHeight)
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    }
  }
</script>
<style lang="scss">
  @import "scss/animate.min.css";
  html, body{
    margin: 0;
    padding: 0;
    height: 100%;
  }
  html { overflow-x: hidden; overflow-y: auto; }
  em {
    color: #FC464E;
    font-style: normal;
  }
  a {
    text-decoration: none;
    color: #000;
  }
  #app {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    max-width: 640px;
    margin: auto;
    font-size: 13px;
    -webkit-tap-highlight-color: transparent;
    overflow: auto;
  }
  @media (min-width: 768px) {
    #app {
      max-width: 700px;
      .foot-menu {
        max-width: 700px;
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
