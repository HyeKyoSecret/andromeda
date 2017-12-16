<template>
  <div class="finger-demo">
  <button @click="chenyixun">触发按钮</button>
  </div>
</template>
<script>
//  import debounce from '../js/throttle.js'
  import Axios from 'axios'
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
        qwert: '',
        searchQuery: '',
        searchQueryIsDirty: false,
        isCalculating: false,
        path: '/me/myCreation'
      }
    },
    created: function () {
      this.stackTest()
    },
    methods: {
      chenyixun () {
        this.$emit('hide')
      },
      stackTest () {
        Axios.get('/story/getStack')
          .then(response => {
            console.log(response.data)
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .img{
    height: 40%;
    width: 30%;
  }
  .green {
    width: 100px;
    height: 100px;
    color: #000;
    background: green;
    &:last-child {
      color: red;
    }
  }
</style>
