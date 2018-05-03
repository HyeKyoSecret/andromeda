<template>
  <div>ceshi333</div>
</template>
<script>
  import Axios from 'axios'
  export default {
    data () {
      return {}
    },
    created: function () {
      this.go()
    },
    methods: {
      go () {
        Axios.get('/register/testGm')
          .then(response => {
            console.log(response.data)
          })
      }
    }
  }
</script>
