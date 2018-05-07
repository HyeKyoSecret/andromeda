<template>
  <div class="aa">
    <div class="c">1</div>
    <div class="c">2</div>
    <div class="c">3</div>
    <div class="c">4</div>
    <div class="c">5</div>
    <div class="c">6</div>
  </div>
</template>
<script>
  export default {
  }
</script>
<style lang="scss" scoped>
  .aa {
    .c {
      width: 80px;
      height: 80px;
      background: red;
      border: 1px solid white;
      &:last-child:after {
        content: '';
        display: block;
        height: 100px;
        background: black;
      }
    }
  }
</style>
