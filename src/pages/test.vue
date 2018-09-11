<template>
  <div>
    <v-touch tag="div" class="hello" v-on:swipeleft="onSwipeLeft">Swipe me!</v-touch>
  </div>
</template>
<script>
  export default {
    methods: {
      onSwipeLeft () {
        alert('swip')
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
