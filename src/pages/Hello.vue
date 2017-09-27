<template>
  <div class="hello">
    <div>vue测试主文件</div>
    <router-link to="/dbTest">
      数据库测试入口
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" scoped>
  @import "../scss/config";

</style>
