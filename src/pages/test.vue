<template>
  <div class="test">
    <div v-for="n in 10">{{n}}</div>
  </div>
</template>
<style lang="scss" scoped>
  .test {
    div {
      width: 100px;
      height: 100px;
      background: #2352AB;
      margin-top: 15px;
    }
  }
</style>
<script>
export default {
  created: function () {
    this.build()
  },
  methods: {
    build () {
      console.log(window.history)
    }
  }
}
</script>
