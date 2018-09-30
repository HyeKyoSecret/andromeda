<template>
  <div>
    abc
  </div>
</template>
<script>
  export default {
    data () {
      return {
        time: null
      }
    },
    created: function () {
      this.getTime()
    },
    methods: {
      getTime () {
        let now = new Date()
        this.time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        console.log(this.time)
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
