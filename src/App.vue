<template>
  <div id="app">
    <transition>
      <keep-alive>
        <router-view v-on:error="closeSelf" v-if="!errorPage && $route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition>
      <router-view v-on:error="closeSelf" v-if="!errorPage && !$route.meta.keepAlive"></router-view>
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
  }
  @media (min-width: 768px) {
    #app {
      max-width: 700px;
      .foot-menu {
        max-width: 700px;
      }
    }
  }
</style>
