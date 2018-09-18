<template>
  <div class="my-creation-node">
    <notice v-bind:title="$route.params.rootName"></notice>
    <!--进度条-->
    <mt-progress :value="percent" :bar-height="6" v-if="percentShow">
      <!--<div slot="end">{{Math.ceil(percent)}}%</div>-->
    </mt-progress>
    <div class="container" v-show="panel">
      <div>
        <img id="cover" class="image-item" :src="url" alt="Picture">
      </div>
      <button type="button" class="button confirm" @click="crop">确定</button>
      <button type="button" class="button cancel" @click="cancelCrop">取消</button>
    </div>
    <label id="input">
      <input type="file" ref="input" accept="image" @change="change">
    </label>
    <div v-if="result">
      <transition
        name="custom-classes-transition"
        leave-active-class="animated bounceOutUp">
      <div class="open-authorized" v-if="!writeAuthorized">
        <div class="line">
          <div class="name">开放自由续写</div>
          <mt-switch v-model="writePermit" class="switch"></mt-switch>
        </div>
      </div>
      </transition>
      <div class="one-node" @click="goStory(result.id)">
        <div class="story-information">
          <div class="cover">
            <div><img :src="imgSrc" @error="setErrorImg" @click.stop="choosePic"/></div>
            <div class="change-cover" v-if='result.user' @click.stop="choosePic">更换封面</div>
          </div>
          <div class="right-part">
            <div class="story-name">
              <span class="name">{{result.rootName}}</span>
              <span class="beginning" v-if="result.user">开头</span>
            </div>
            <div class="story-content">{{result.rootContent}}</div>
            <div class="like-quantity">
              <span><img src="../../img/icon/gray_thumb.png" /></span>
              <span>{{result.zan}}次</span>
            </div>
            <div class="time">{{result.date}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class='preview-content' v-if="result.story">
      <div class="story-preview"  v-for="(item, index) in result.story" :key="item.id" @click="goStory(item.id)">
        <div class="content">{{item.content}}</div>
        <div class="info">
          <span><img src="../../img/icon/gray_thumb.png" /></span>
          <span>{{item.zan}}</span>
          <span class="date">{{item.date}}</span>
        </div>
      </div>
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import Cropper from 'cropperjs'
  import notice from '../../components/notice/notice.vue'
  import Axios from 'axios'
  import lrz from 'lrz'
  import { Toast, Indicator } from 'mint-ui'
  export default {
    components: {
      notice,
      FootMenu
    },
    data () {
      return {
        result: {},
        writePermit: true,
        writeAuthorized: true,
        coverImage: '',      // 以下直到url为上传图片所需数据
        picValue: '',
        cropper: '',
        croppable: false,
        panel: false,
        imgSrc: '',
        url: '',
        file: '',          // 封面图片文件
        fileName: '',
        fileExt: '',      // 封面图片后缀名
        coverErrorMessage: '',
        percent: 0,
        percentShow: false
      }
    },
    watch: {
      // writePermit: function (curVal) {
      //   if (curVal !== false) {
      //     MessageBox.confirm('开放自由续写后将无法再关闭，确认开放吗?').then(action => {
      //       Axios.post('/story/changeWritePermit', {
      //         rootName: this.result.root.name,
      //         writePermit: curVal
      //       }).then((response) => {
      //         if (response.data === 'error') {
      //           Toast({
      //             message: '网络错误，请稍后再试',
      //             position: 'middle',
      //             duration: 1000
      //           })
      //         } else {
      //           this.writeAuthorized = true
      //         }
      //       })
      //     }).catch(action => {
      //       this.writePermit = false
      //     })
      //   }
      // }
    },
    created: function () {
      this.getMyCreationNode()
    },
    mounted () {
      // 初始化这个裁剪框
      var self = this
      var cover = document.getElementById('cover')
      this.cropper = new Cropper(cover, {
        dragMode: 'move',
        aspectRatio: 3 / 4,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        background: false,
        zoomable: false,
        ready: function () {
          self.croppable = true
        }
      })
    },
    methods: {
      choosePic () {
        if (this.result.user) {
          this.$refs.input.click()
        }
      },
      getObjectURL (file) {
        let url = null
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
        this.fileName = files[0].name
        this.fileExt = files[0].name.split('.')[1]
        if (!files.length) return
        this.panel = true
        this.picValue = files[0]
        let self = this
        lrz(this.picValue, {width: 800, quality: 0.7}) // 压缩图片
          .then(function (rst) {
            self.url = rst.base64
            // 每次替换图片要重新得到新的url
            if (self.cropper) {
              self.cropper.replace(self.url)
            }
            self.panel = true
          })
      },
      changeToFile (dataurl) {
        let arr = dataurl.split(',')
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
        let croppedCanvas
        // var roundedCanvas
        if (!this.croppable) {
          return
        }
        //  Crop
        croppedCanvas = this.cropper.getCroppedCanvas()
        this.coverImage = croppedCanvas.toDataURL()
        this.file = this.changeToFile(this.coverImage)
        let ext = ['jpg', 'gif', 'jpeg', 'gif', 'bmp', 'png']
        let flag = ext.some(function (val) {
          if (this.fileExt) {
            return val === this.fileExt.toLocaleLowerCase()
          } else {
            return false
          }
        }.bind(this))
        if (this.file && flag) {
          this.postImg()
        } else if (this.file && !flag) {
          Toast({
            message: '请选择图片上传',
            position: 'middle',
            duration: 1000
          })
        }
      },
      cancelCrop () {
        this.panel = false
      },
      postImg () {
        this.percentShow = true
        Indicator.open('上传中...')
        let self = this
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 20000,
          onUploadProgress: function (progressEvent) {
            self.$nextTick(() => {
              self.percent = (progressEvent.loaded / progressEvent.total) * 100
            })
          }
        }
        let formData = new FormData()
        formData.append('file', this.file, this.fileName)
        formData.append('rootName', this.$route.params.rootName)
        formData.append('id', this.$route.params.user)
        Axios.post('/story/updateCover', formData, config).then(response => {
          Indicator.close()
          Toast({
            message: response.data.message,
            position: 'middle',
            duration: 1000
          })
          this.imgSrc = response.data.result
          this.percentShow = false
          this.$emit('refreshImg', this.$route.params.rootName, response.data.result)
        }).catch(error => {
          Indicator.close()
          if (error) {
            Toast({
              message: '请求超时，请检查网络环境',
              position: 'middle',
              duration: 1000
            })
            this.percent = 0
            this.percentShow = false
          }
        })
      },
      setErrorImg: function () {
        this.imgSrc = require('../../img/photo/defaultPic.png')
      },
      getMyCreationNode () {
        Axios.get('/user/getMyCreationNode', {
          params: {
            user: this.$route.params.user,
            root: this.$route.params.rootName
          }
        }).then(response => {
          if (!response.data.error) {
            this.result = response.data.result
            this.imgSrc = response.data.result.coverImg
          } else {
            this.$emit('error')
          }
        })
      },
      goStory: function (id) {
        this.$router.push(`/story/${id}`)
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/animate.min.css";
  @import "../../scss/config";
  /*@import "../../scss/cropper.css";*/
  .my-creation-node {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: $bg-gray;
    .image-item {
      max-width: 100%;
    }
    .open-authorized {
      width: 100%;
      border-top: 1px solid $border-gray;
      height: 70px;
      background: white;
      color: $font-dark;
      .line {
        margin-top: 15px;
        display: flex;
        align-items: center;
        .name {
          flex: 5;
          margin-left: 15px;
          font-size: 16px;
        }
        .switch {
          flex: 1;
          margin-left: 15px;
        }
      }
    }
    .one-node {
      height: 145px;
      width: 100%;
      background-color: white;
      margin-top: 25px;
      .story-information {
        margin-left: 10px;
        margin-right: 10px;
        height: 100px;
        display: flex;
        align-items:flex-start;
        .cover {
          margin-top: 10px;
          flex: 1;
          img {
            height: 88px;
            width: 66px;
          }
          .change-cover {
            height: 20px;
            width: 70px;
            margin: 10px 5px 0 -1px;
            background-color: $main-color;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            text-align: center;
            line-height: 20px;
          }
        }
        .right-part {
          margin-top: 8px;
          flex: 3;
          .story-name {
            color: $font-dark;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            .name {
              flex:3;
              text-align: left;
            }
            .beginning {
              margin-left: 50px;
              flex: 1;
              text-align: center;
              height: 20px;
              border:1px solid $icon-red;
              border-radius: 5px;
              font-size: 14px;
              color: $icon-red;
              font-weight: normal;
            }
          }
          .story-content {
            margin-top: 3px;
            min-height: 50px;
            color: $font-dark;
            font-size: 14px;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            -moz-box-orient: vertical;
            -moz-line-clamp: 3;
            overflow: hidden;
          }
          .like-quantity  {
            text-align: right;
            font-size: 14px;
            color: $font-gray;
            margin-top: 10px;
            img {
              height: 14px;
              width: 14px;
              vertical-align: center;
            }
          }
          .time {
            text-align: right;
            font-size: 14px;
            color: $font-gray;
          }
        }
      }
    }
    .preview-content {
      .story-preview {
        margin-top: 10px;
        width: 100%;
        background: white;
        &:last-child:after {
          content: '';
          display: block;
          height: 100px;
          width: 100%;
          background: $bg-gray;
        }
        .content {
          width: 95%;
          margin: 0 auto;
          padding-top: 15px;
          min-height: 28px;
          display: -webkit-box;
          display: -moz-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          -moz-box-orient: vertical;
          -moz-line-clamp: 2;
          overflow: hidden;
          font-size: 14px;
          color: $font-dark;
        }
        .info {
          height: 30px;
          line-height: 30px;
          margin-top: 15px;
          border-top: 1px solid $bg-gray;
          text-align: right;
          font-size: 14px;
          color: $font-gray;
          img {
            width: 14px;
          }
          .date {
            margin-left: 15px;
            margin-right: 15px;
          }
        }
      }
    }

  }
</style>
