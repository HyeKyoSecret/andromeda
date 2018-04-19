<template>
  <div class="tag">
    <input type="file" @change="previewFile"><br>
    <img :src="imgsrc" height="200" width="200">
  </div>
</template>
<script>
  // import {imgCut} from 'vue-imgcut'
  // import Axios from 'axios'
  export default {
    data () {
      return {
        imgsrc: ''
      }
    },
    components: {
      // imgCut
    },
    created: function () {
      // this.check()
    },
    methods: {
      // check () {
      //   if (typeof FileReader === 'undefined') {
      //     alert('ss')
      //   } else {
      //     alert('3445454676787')
      //   }
      // },
      // callback (img) {
      //   this.imgsrc = img
      //   let file = this.change(img, 'a.jpg')
      //   console.log(file)
      //   let config = {
      //     headers: {
      //       'Content-Type': 'multipart/form-data'
      //     }
      //   }
      //   let fromData = new FormData()
      //   fromData.append('file', file)
      //   Axios.post('/test/upload', fromData, config)
      //     .then(response => {
      //       console.log(response.data)
      //     })
      // },
      // change (dataurl, filename) {
      //   var arr = dataurl.split(',')
      //   let mime = arr[0].match(/:(.*?);/)[1]
      //   let bstr = atob(arr[1])
      //   let n = bstr.length
      //   let u8arr = new Uint8Array(n)
      //   while (n--) {
      //     u8arr[n] = bstr.charCodeAt(n)
      //   }
      //   return new File([u8arr], filename, {type: mime})
      // }
      previewFile () {
        var file = document.querySelector('input[type=file]').files[0]
        var reader = new FileReader()
        // reader.addEventListener('load', function () {
        //   preview.src = reader.result
        // }, false)

        reader.onload = function () {
          console.log(reader.result)
          this.imgsrc = reader.result
        }

        if (file) {
          reader.readAsDataURL(file)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../scss/style.css";

  .tag {
    width: 200px;
    height: 200px;
    border: 1px solid red;
  }
  .parents {
    .hello {
      display: flex;
      .left {
        width: 80px;
        height: 80px;
        background-color: red;
      }
      .right {
        width: 120px;
        height: 80px;
        background-color: yellow;
        border-bottom: 3px solid green;
      }
      &:nth-child(3) .right {
        border: 1px solid blue;
      }
    }
  }
</style>
