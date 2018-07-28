<template>
  <div>
    <textarea>Tt, which, botanically, is a drupe, not a nut. The spelling cocoanut is an archaic form of the word.[3] The term is derived from 16th-century Portuguese and Spanish coco, meaning "head" or "skull",[4] from the three small holes on the coconut shell that resemble human facial features.</textarea>
  </div>
</template>
<script>
  import autosize from 'autosize'
  export default {
    mounted: function () {
      autosize(document.querySelectorAll('textarea'))
    }
  }
</script>
<style>

</style>