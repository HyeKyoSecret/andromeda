<template>
  <div class="finger-demo">
    <p @click="og">helloworld</p>
    <button @click="go(1)">show</button>
    <div class="test" v-show="showMe1">
      0423904739493472937423894792347392743
    </div>
    <div class="img">
      <img src="../img/photo/head.jpg" alt="">
    </div>
    <div>
      abv{{qwert}}
      <input type="text" v-model="qwert" style="border: 1px solid red">
    </div>
    <div>
      改变后 {{afterChange}}
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
        details: '',
        showMe1: false,
        qwert: ''
      }
    },
    computed: {
      afterChange: function () {
        return this.qwert.replace(/\$/g, '&dl').replace(/</g, '&lt').replace(/>/g, '&gt')
      }
    },
    methods: {
      og () {
        let hello = {
          a: 1,
          b: 2
        }
        hello.c = 3
        console.log(hello)
      },
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
