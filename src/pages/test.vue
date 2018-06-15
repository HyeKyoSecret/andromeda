<template>
  <div class="aa">
    {{time}}
    <slot></slot>
    <router-link to="/people">揍你</router-link>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        time: '',
        hello: 123
      }
    },
    created: function () {
      console.log('创建' + this.$route.name + this.hello + '***' + this.$route.meta.keepAlive)
      let date = new Date()
      this.time = date.getTime()
    },
    activated: function () {
      console.log('激活')
    },
    deactivated: function () {
      console.log('离开')
    }
  }
</script>
<style lang="scss" scoped>
  .aa {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1000px;
    background: darkseagreen;
    font-size: 20px;
  }
</style>
