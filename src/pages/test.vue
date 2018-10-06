<template>
  <div>
    abc
  </div>
</template>
<script>
  export default {
    data () {
      return {
        a: {
          b: 'hello',
          c: 1
        }
      }
    },
    created: function () {
      this.getTime()
    },
    methods: {
      getTime () {
        if (this.a.b === 'ello') {
          console.log('123')
        } else if (this.a.c === 1) {
          console.log('456')
        }
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
