<template>
  <div>
    <div class="abs">
      <div class="bounce" v-for="n in 5">
        f3445
      </div>
    </div>
  </div>
</template>
<script>

</script>
<style lang="scss">
  .abs {
    .bounce {
      width: 100px;
      height: 100px;
      border: 1px solid black;
      &:last-child {
        background: firebrick;
      }
    }
  }
</style>
