<template>
  <div class="finger-demo">
    <p @click="og">helloworld</p>
    <!--<div id="debounce-search-demo">-->
      <!--<input v-model="searchQuery" placeholder="Type something">-->
      <!--<strong>{{ searchIndicator }}</strong>-->
    <!--</div>-->
  </div>
</template>
<script>
  import debounce from '../js/throttle.js'
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
        isCalculating: false
      }
    },
    methods: {
      og: debounce(function () {
        console.log(this.message)
        console.log('123')
      }, 500),
      test () {
        let p = 0
        let sleep = function (time) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              p = p + 1
              resolve(p)
              reject('error')
            }, time)
          })
        }
        let start = async function () {
          while (p < 50) {
            p = await sleep(400)
            console.log(p)
          }
        }
        start()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .img{
    height: 40%;
    width: 30%;
  }
</style>
