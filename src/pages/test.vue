<template>
  <div class="aa">
    <v-touch v-on:press="longTap">Swipe me!</v-touch>
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
        console.log('longTap!')
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
