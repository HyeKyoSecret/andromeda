<template>
  <div class="finger-demo">
    <p @click="check">helloworld</p>
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
      check () {
        try {
          if (!this.details) {
            throw new Error(this.message)
          }
        } catch (e) {
          alert(e.message)
        } finally {
          console.log('完成')
        }
      }
    }
  }
</script>
<style>
  .finger-demo{width:100%;text-align:center;}
  .finger-demo-img{width:80%;}
</style>
