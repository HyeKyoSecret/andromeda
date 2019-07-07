<template>
  <div class="new-story">
    <div class="first-step" v-show="firstStep">
      <div class="notice">
      <span class="icon" @click="leaveBuild">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        输入故事名字
      </span>
      <span class="fake-next-step" v-if='!rootNameCheck'>
        下一步
      </span>
      <span class="next-step" @click="storyRoute(2)" v-else>
        下一步
      </span>
      </div>
      <div class="input-name">
        <div class="input" ><input type="text" placeholder="请输入故事名字" v-model.trim="rootName"></div>
      </div>
      <div class="gradient-line"></div>
      <div class="error-info">{{rootNameError}}</div>
    </div>
    <div class="second-step" v-show="secondStep">
      <div class="notice">
      <span class="icon" @click="storyRoute(1)">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        添加封面图片
      </span>
      <span class="fake-next-step" v-if='!coverCheck'>
        下一步
      </span>
      <span class="next-step" @click="storyRoute(3)" v-else>
        下一步
      </span>
      </div>
      <div class="story-name">
        {{rootName}}
      </div>
      <div class="container" v-show="panel">
        <div>
          <img id="image" :src="url" class="img-item" alt="Picture">
        </div>
        <button type="button" class="button confirm" @click="crop">确定</button>
        <button type="button" class="button cancel" @click="cancelCrop">取消</button>
      </div>
      <div>
        <div class="story-pic" v-if="url" @click="choosePic">
          <div class="picture" :style="'backgroundImage:url('+coverImage+')'"></div>
        </div>
        <label id="input">
          <input type="file" ref="input" id="change" accept="image" @change="change">
        </label>
      </div>
      <div class="story-pic" @click="choosePic" v-if="!url">
        <img src="../../img/photo/defaultPic.png"/>
      </div>
      <div class="error-info">
        {{coverErrorMessage}}
      </div>
    </div>
    <div class="third-step" v-show="thirdStep">
      <div class="notice">
      <span class="icon" @click="storyRoute(2)">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        {{rootName}}
      </span>
      <span class="fake-commit" v-if='!buildCheck'>下一步</span>
      <span class="commit" @click="openRecommend" v-else>下一步</span>
      </div>
      <div class="context">
        <textarea id="context" name="context" placeholder="在这里书写故事的开头" v-model="rootContent" rows="16"></textarea>
      </div>
      <div class="permission">
        <div class="line">
          <div class="name">开放自由续写</div>
          <mt-switch v-model="writePermit" class="switch"></mt-switch>
        </div>
        <div class="tip">关闭将导致其他人不能续写你的故事</div>
      </div>
    </div>
    <div class="fourth-step" v-show="fourthStep">
      <story-recommend ref="recommend" v-on:build="buildRoot" v-on:back="storyRoute(3)" :buildPermit="buildPermit">
        <mt-progress :value="percent" :bar-height="6">
          <!--<div slot="end">{{Math.ceil(percent)}}%</div>-->
        </mt-progress>
      </story-recommend>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  @import "../../scss/cropper.css";
    .first-step {
      height: 100vh;
      width: 100%;
      background: white;
      .notice {           // 新建notice
        background: $main-color;
        height: 42px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          text-align: center;
        }
        .icon {
          position: absolute;
          left: 11px;
          display: inline-block;
          width: 35px;
          height: 42px;
          line-height: 52px;
        }
        .title {
          font-size: 16px;
        }
        .next-step {
          position: absolute;
          right: 11px;
          font-size: 14px;
          display: inline-block;
          height: 42px;
          width: 50px;
          line-height: 42px;
        }
        .fake-next-step {
          color: $font-color;
          position: absolute;
          right: 11px;
          font-size: 14px;
          display: inline-block;
          height: 42px;
          width: 50px;
          line-height: 42px;
        }
        img {
          width: 12px;
          height: 20px;
        }
      }
      .input-name {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 200px;
        .input {
          width: 100%;
        }
        input {
          padding-top: 15px;
          color: $font-dark;
          border: none;
          outline: none;
          height: 42px;
          font-size: 18px;
          overflow: hidden;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }
      }
      .error-info {
        text-align: center;
        margin-top: 12px;
        color: $main-red;
      }
      .gradient-line {
        height: 1px;
        background-image: linear-gradient(-90deg,white,#bfbfbf,white);
      }
    }
    .second-step {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      background: white;
      .notice { // 新建notice
        background: $main-color;
        height: 42px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          text-align: center;
        }
        .icon {
          position: absolute;
          left: 11px;
          display: inline-block;
          width: 35px;
          height: 42px;
          line-height: 52px;
        }
        .title {
          font-size: 16px;
        }
        .fake-next-step {
          color: $font-color;
          position: absolute;
          right: 11px;
          font-size: 14px;
          display: inline-block;
          height: 42px;
          width: 50px;
          line-height: 42px;
        }
        .next-step {
          position: absolute;
          right: 11px;
          font-size: 14px;
          display: inline-block;
          height: 42px;
          width: 50px;
          line-height: 42px;
        }
        img {
          width: 12px;
          height: 20px;
        }
      }
      .story-name {
        text-align: center;
        color: $font-dark;
        font-size: 16px;
        margin-top: 30px;
      }
      .story-pic {
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        img, .picture{
          height:160px;
          width: 170px;
          padding: 107px 55px 107px 55px;
          border: 2px solid $border-gray;
        }
      }
      .error-info {
        text-align: center;
        color: $main-red;
        margin-top: 10px;
      }
      .recommend {
        text-align: center;
        color: $font-gray;
        margin-top: 10px;
      }
    }
    .third-step {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      background: white;
      .notice { // 新建notice
        background: $main-color;
        height: 42px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          text-align: center;
          display: inline-block;
        }
        .title {
          font-size: 16px;
        }
        .icon {
          position: absolute;
          left: 11px;
          display: inline-block;
          width: 35px;
          height: 42px;
          line-height: 52px;
        }
        .commit {
          position: absolute;
          right: 11px;
          text-align: center;
          font-size: 14px;
          width: 45px;
          height: 42px;
          line-height: 42px;
        }
        .fake-commit {
          color: $font-color;
          position: absolute;
          right: 11px;
          text-align: center;
          font-size: 14px;
          width: 45px;
          height: 42px;
          line-height: 42px;
        }
        img {
          width: 12px;
          height: 20px;
        }
      }
      .story-name {
        text-align: center;
        color : $font-dark;
        font-size: 16px;
        margin-top: 20px;
      }
      .context  {
        display:flex;
        align-items: center;
        justify-content: center;
        textarea {
          height: calc(100vh - 150px);
          width: 100%;
          border: none;
          outline: none;
          font-size: 16px;
          padding: 5px;
          line-height: 20px;
        }
      }
      .permission {
        margin-top: 10px;
        width: 100%;
        border-top: 1px solid $border-gray;
        .line {
          margin-top: 15px;
          display: flex;
          align-items: center;
          .name {
            flex: 4;
            margin-left: 15px;
            font-size: 16px;
          }
          .switch {
            flex: 1;
            margin-left: 18%;
          }
        }
        .tip {
          margin-left: 15px;
          color: $font-gray;
        }
      }
    }


</style>
<script>
  import Axios from 'axios'
  import lrz from 'lrz'
  import Cropper from 'cropperjs'
  import Debounce from '../../js/debounce.js'
  import { MessageBox, Toast, Indicator } from 'mint-ui'
  import StoryRecommend from '../../components/story/buildStoryRecommend.vue'
  export default {
    components: {
      StoryRecommend
    },
    data () {
      return {
        firstStep: true,
        secondStep: false,
        thirdStep: false,
        fourthStep: true,
        rootName: '',
        rootNameError: '',
        rootNameCheck: false,
        rootContent: '',
        writePermit: true, // 允许续写
        buildCheck: false,  // 允许发布
        coverImage: '',      // 以下直到url为上传图片所需数据
        picValue: '',
        cropper: '',
        croppable: false,
        panel: false,
        url: '',
        file: '',          // 封面图片文件
        fileName: '',
        fileExt: '',      // 封面图片后缀名
        coverErrorMessage: '',
        buildPermit: true,
        percent: 0,
        recommend: []   //  推荐列表
      }
    },
    computed: {
      coverCheck: function () {
        let ext = ['jpg', 'gif', 'jpeg', 'gif', 'bmp', 'png']
        let flag = ext.some(function (val) {
          if (this.fileExt) {
            return val === this.fileExt.toLocaleLowerCase()
          } else {
            return false
          }
        }.bind(this))
        if (this.file && flag) {
          this.coverErrorMessage = ''
        } else if (this.file && !flag) {
          this.coverErrorMessage = '请上传图片格式的文件'
        } else if (!this.file) {
          this.coverErrorMessage = '点击选框上传封面图片'
        }
        return this.file && flag
      }
    },
    watch: {
      rootContent: function () {
        var tmp = document.querySelector('#context').value
        var lines = tmp.split(/\r*\n/)
        var linesCount = lines.length - (navigator.userAgent.indexOf('MSIE') !== -1)
        if (!this.rootContent) {
          this.buildCheck = false
          Toast({
            message: `内容不能为空`,
            position: 'middle',
            duration: 1000
          })
        } else {
          if (this.rootContent.length > 220) {
            this.buildCheck = false
            Toast({
              message: `您已超过最大字数${this.rootContent.length - 220}字`,
              position: 'middle',
              duration: 1000
            })
          } else if (linesCount > 13) {
            Toast({
              message: `行数超过限制`,
              position: 'middle',
              duration: 1000
            })
          } else {
            this.buildCheck = true
          }
        }
      },
      rootName: function () {
        if (!this.rootName) {
          this.rootNameError = '故事名不能为空'
          this.rootNameCheck = false
        } else {
          if (this.rootName.length > 15) {
            this.rootNameError = '故事名最多为15个字符'
            this.rootNameCheck = false
          } else {
            this.rootNameError = ''
            this.rootRepeatCheck()
          }
        }
      }
    },
    mounted () {
      // 初始化这个裁剪框
      let self = this
      let image = document.getElementById('image')
      this.cropper = new Cropper(image, {
        dragMode: 'move',
        aspectRatio: 3 / 4,
        viewMode: 1,
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
    created: function () {
      this.loadDraft()
    },
    methods: {
      choosePic () {
        this.$refs.input.click()
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
        let temp = files[0].name.split('.')
        this.fileExt = temp[temp.length - 1]
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
      },
      cancelCrop () {
        this.panel = false
      },
      loadDraft () {
        Axios.get('/story/getRootDraft')
          .then(response => {
            if (response.data.draft) {
              this.rootName = response.data.name
              this.rootContent = response.data.content
              this.writePermit = response.data.writePermit
            } else {
              this.rootName = ''
              this.rootContent = ''
              this.writePermit = true
            }
          }).catch(error => {
            if (error) {
              this.rootName = ''
              this.rootContent = ''
              this.writePermit = true
            }
          })
      },
      storyRoute (param) {
        switch (param) {
          case 1:
            this.firstStep = true
            this.secondStep = false
            this.thirdStep = false
            break
          case 2:
            this.firstStep = false
            this.secondStep = true
            this.thirdStep = false
            break
          case 3:
            this.firstStep = false
            this.secondStep = false
            this.thirdStep = true
            break
        }
      },
      openRecommend () {
        this.$refs.recommend.openRecommend()
      },
      rootRepeatCheck: Debounce(function () {
        Axios.get('/checkRootName', {
          params: {
            name: this.rootName
          }
        }).then((response) => {
          if (response.data === 'exist') {
            this.rootNameError = '故事名已经存在'
            this.rootNameCheck = false
          } else if (response.data === 'ok') {
            this.rootNameError = ''
            this.rootNameCheck = true
          }
        }).catch((err) => {
          if (err) {
            this.rootNameError = '发生错误，请稍后再试'
            this.rootNameCheck = false
          }
        })
      }, 500),
      buildRoot (recommend) {
        Indicator.open('上传故事中…')
        this.recommend = recommend
        this.buildPermit = false
        this.buildCheck = false
        let self = this
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 25000,
          onUploadProgress: function (progressEvent) {
            self.$nextTick(() => {
              self.percent = (progressEvent.loaded / progressEvent.total) * 100
            })
          }
        }
        let formData = new FormData()
        formData.append('file', this.file, this.fileName)
        formData.append('name', this.rootName)
        formData.append('content', this.rootContent)
        formData.append('recommendLength', this.recommend.length)
        for (let i = 0; i < this.recommend.length; i++) {
          formData.append(`recommend[${i}]`, this.recommend[i].id)
        }
        formData.append('writePermit', this.writePermit)
        Axios.post('/story/buildRoot', formData, config).then((response) => {
          Indicator.close()
          if (response.data.permit === true) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
            this.$router.push('/story/' + response.data.id)
            // 发布成功的处理
          } else {
            this.buildCheck = true
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
          this.buildPermit = true
        }).catch(error => {
          Indicator.close()
          this.buildPermit = true
          if (error) {
            Toast({
              message: '封面上传失败，请在"我的创作"中重新上传',
              position: 'middle',
              duration: 2500
            })
            this.$router.go(-2)
          }
        })
        setTimeout(function () {      // 超时处理
          this.buildCheck = true
        }.bind(this), 5000)
      },
      leaveBuild () {
        if (this.rootName || this.rootContent) {
          MessageBox.confirm('是否保存草稿?').then(action => {
            Axios.post('/story/saveRootDraft', {
              rootName: this.rootName,
              rootContent: this.rootContent,
              writePermit: this.writePermit
            }).then(response => {
              if (response.data.permit) {
                // 草稿保存成功的路由跳转
                this.$router.go(-1)
              } else {
                Toast({
                  message: response.data.message,
                  position: 'middle',
                  duration: 1000
                })
              }
            }).catch(error => {
              if (error) {
                Toast({
                  message: '草稿保存失败',
                  position: 'middle',
                  duration: 1000
                })
              }
              this.$router.go(-1)
            })
          }).catch(error => {
            if (error) {
              this.$router.go(-1) // 离开的路由跳转
            }
          })
        } else {
          this.$router.push('/discover')
        }
      }
    }
  }
</script>
