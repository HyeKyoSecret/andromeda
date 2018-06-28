<template>
  <div class="aa">
    <div class="b">开始自闭</div>
    <div><mt-switch v-model="writePermit" class="switch"></mt-switch>
    </div>
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
  @import '../scss/style.css';
  .aa {
    height: 80px;
    width: 210px;
    margin-left: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      font-size: 21px;
      flex: 1;
    }

  }
</style>
