<template>
  <div id="demo">
    <!-- 遮罩层 -->
    <div class="container" v-show="panel">
      <div>
        <img id="image" :src="url" alt="Picture">
      </div>
      <button type="button" id="button" @click="crop">确定</button>
    </div>
    <div style="padding:20px;">
      <div class="show">
        <div class="picture" :style="'backgroundImage:url('+headerImage+')'">
        </div>
      </div>
      <div style="margin-top:20px;">
        <input type="file" id="change" accept="image" @change="change">
        <label for="change"></label>
      </div>
    </div>
  </div>
</template>
<script>
  import Cropper from 'cropperjs'
  import Axios from 'axios'
  export default {
    components: {
    },
    data () {
      return {
        headerImage: '',
        picValue: '',
        cropper: '',
        croppable: false,
        panel: false,
        url: '',
        imgsrc: ''
      }
    },
    mounted () {
      // 初始化这个裁剪框
      var self = this
      var image = document.getElementById('image')
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        zoomable: false,
        ready: function () {
          self.croppable = true
        }
      })
    },
    methods: {
      callback (img) {
        this.imgsrc = img
      },
      getObjectURL (file) {
        var url = null
        if (window.createObjectURL !== undefined) { //  basic
          url = window.createObjectURL(file)
        } else if (window.URL !== undefined) { //  mozilla(firefox)
          url = window.URL.createObjectURL(file)
        } else if (window.webkitURL !== undefined) { //  webkit or chrome
          url = window.webkitURL.createObjectURL(file)
        }
        return url
      },
      change (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.panel = true
        this.picValue = files[0]

        this.url = this.getObjectURL(this.picValue)
        // 每次替换图片要重新得到新的url
        if (this.cropper) {
          this.cropper.replace(this.url)
        }
        this.panel = true
      },
      changeToFile (dataurl) {
        var arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type: mime})
      },
      crop () {
        this.panel = false
        var croppedCanvas
        // var roundedCanvas
        if (!this.croppable) {
          return
        }
        //  Crop
        croppedCanvas = this.cropper.getCroppedCanvas()
        console.log(this.cropper)
        // //  Round
        // roundedCanvas = this.getRoundedCanvas(croppedCanvas)

        this.headerImage = croppedCanvas.toDataURL()
        this.postImg()
      },
      getRoundedCanvas (sourceCanvas) {
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        var width = sourceCanvas.width
        var height = sourceCanvas.height

        canvas.width = width
        canvas.height = height

        context.imageSmoothingEnabled = true
        context.drawImage(sourceCanvas, 0, 0, width, height)
        context.globalCompositeOperation = 'destination-in'
        context.beginPath()
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true)
        context.fill()

        return canvas
      },
      postImg () {
        let file = this.changeToFile(this.headerImage)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        let formData = new FormData()
        formData.append('file', file, '123.png')
        Axios.post('/test/upload', formData, config).then(response => {
          console.log(response.data)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/cropper.css";
</style>
