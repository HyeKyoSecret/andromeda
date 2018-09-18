<template>
  <div id="app">
    <transition name="slide-left">
      <keep-alive>
        <router-view v-on:error="closeSelf" v-if="!errorPage && $route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="slide-left">
      <router-view v-on:error="closeSelf" v-if="!errorPage && !$route.meta.keepAlive"></router-view>
    </transition>
    <ErrorPage v-if="errorPage"></ErrorPage>
  </div>
</template>
<script>
  // import FastClick from 'fastclick'
  import ErrorPage from './components/error/errorPage.vue'
  export default {
    name: 'app',
    data () {
      return {
        errorPage: false
      }
    },
    components: {
      ErrorPage
    },
    methods: {
      closeSelf () {
        this.errorPage = true
      }
    }
    /*
    ,
     created: function () {
      document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
      }, false)
    }
    */
  }
</script>
<style lang="scss">
  html, body{
    margin: 0;
    padding: 0;
    height: 100%;
  }
  a {
    text-decoration: none;
    color: #000;
  }
  #app {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    max-width: 640px;
    margin: auto;
    font-size: 13px;
    background: #fff;
    -webkit-tap-highlight-color: transparent;
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
    transition: opacity .3s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
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
