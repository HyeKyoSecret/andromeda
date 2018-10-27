<template>
  <div>
    abc
  </div>
</template>
<script>
  import Axios from 'axios'
  export default {
    data () {
      return {
      }
    },
    created: function () {
      // this.buildData()
    },
    methods: {
      buildData () {
        Axios.post('/user/buildHistory')
          .then(response => {
            console.log(response.data.history)
          })
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
