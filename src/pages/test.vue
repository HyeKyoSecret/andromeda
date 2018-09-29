<template>
  <div>
    abc
  </div>
</template>
<script>
  import pinyin from 'pinyin'
  export default {
    created: function () {
      this.a()
    },
    methods: {
      a () {
        console.log(pinyin('牛腩'))
      }
    }
  }
</script>
<style lang="scss">
.hello {
  width: 300px;
  height: 300px;
  background: yellow;
  border: 1px solid black;
}
</style>
