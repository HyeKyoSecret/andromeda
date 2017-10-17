<template>
  <div class="finger-demo">
    <p @click="test">helloworld</p>
    <div class="flex-test">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        left: 0,
        top: 0,
        scale: 1,
        angle: 0,
        initScale: 1,
        message: '真的有错误',
        details: ''
      }
    },
    methods: {
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
</style>
