<template>
  <div>
    <div>
      helloWorld
    </div>
    <footMenu class="hehe">
      <slot>
        <div>A</div>
        <div>b</div>
        <div>c</div>
        <div @click="getYou">d</div>
      </slot>
    </footMenu>
  </div>
</template>
<script>
//  import Axios from 'axios'
  import FootMenu from '../components/foot-menu.vue'
  export default {
    data () {
      return {
        left: 0,
        top: 0,
        scale: 1,
        angle: 0,
        initScale: 1,
        message: '真的有错误',
        details: '',
        showMe1: false,
        qwert: [1, 2, 3, 4, 5],
        searchQuery: '',
        searchQueryIsDirty: false,
        isCalculating: false,
        path: '/me/myCreation'
      }
    },
    components: {
      FootMenu
    },
    methods: {
      getYou () {
        alert('ffff')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .hehe {
    div {
      width: 50px;
    }
  }
</style>
