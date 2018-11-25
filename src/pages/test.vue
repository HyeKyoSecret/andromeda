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
      this.buildData()
    },
    methods: {
      buildData () {
        Axios.post('/user/testEs', {
          id: 13145621
        }).then(response => {
          console.log(response)
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
