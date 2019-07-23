<template>
  <div class="test">
    <div @click="go">abbbbb</div>
  </div>
</template>
<style lang="scss" scoped>

</style>
<script>
export default {
  data () {
    return {
      words: 'hello.pick.andromeda.txt'
    }
  },
  methods: {
    go () {
      this.$store.commit('increment')
      console.log(this.$store.state.count)
    }
  }
}
</script>
