<template>
  <div class="aa">
    <div v-finger:long-tap="longTap">helloWorld</div>
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
    methods: {
      longTap: function () {
        console.log('jihuo')
      }
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
