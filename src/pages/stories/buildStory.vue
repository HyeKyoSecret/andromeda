<template>
  <div class="new-story">
    <div class="first-step" v-show="firstStep">
      <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        输入故事名字
      </span>
      <span class="next-step" @click="storyRoute(2)">
        下一步
      </span>
      </div>
      <div class="input-name">
        <div class="input" ><input type="text" placeholder="请输入故事名字" v-model="rootName"></div>
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
      <span class="next-step" @click="storyRoute(3)">
        下一步
      </span>
      </div>
      <div class="story-name">
        塞尔达传说
      </div>
      <div class="story-pic">
        <img src="../../img/photo/defaultPic.png"/>
      </div>
      <div class="error-info">
        上传的图片大小过大
      </div>
      <div class="recommend">
        *建议上传3:4 比例的图片
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
      <span class="commit" @click="buildRoot">发布</span>
      </div>
      <div class="context">
        <textarea  name="context" placeholder="在这里书写您的故事" v-model="rootContent"></textarea>
      </div>
      <div class="permission">
        <div class="line">
          <div class="name">开放自由续写</div>
          <mt-switch v-model="writePermit" class="switch"></mt-switch>
        </div>
        <div class="tip">关闭将导致其他人不能续写你的故事</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
    .first-step {
      height: 100%;
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
        img{
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
            flex: 3;
            margin-left: 15px;
            font-size: 16px;
          }
          .switch {
            flex: 1;
            margin-left: 15px;
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
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        firstStep: true,
        secondStep: false,
        thirdStep: false,
        rootName: '',
        rootNameError: '',
        rootContent: '',
        writePermit: true
      }
    },
    watch: {
      rootContent: function () {
        if (this.rootContent.length > 180) {
          Toast({
            message: `您已超过最大字数${this.rootContent.length - 180}字`,
            position: 'middle',
            duration: 1000
          })
        }
      }
    },
    methods: {
      storyRoute (param) {
        switch (param) {
          case 1:
            this.firstStep = true
            this.secondStep = false
            this.thirdStep = false
            break
          case 2:
            this.rootNameCheck()
            break
          case 3:
            this.firstStep = false
            this.secondStep = false
            this.thirdStep = true
            break
        }
      },
      rootNameCheck () {
        if (!this.rootName) {
          this.rootNameError = '故事名不能为空'
          return 0
        }
        if (this.rootName.length > 12) {
          this.rootNameError = '用户名最多为12个字符'
          return 0
        }
        Axios.get('/checkRootName', {
          params: {
            name: this.rootName
          }
        }).then((response) => {
          if (response.data === 'exist') {
            this.rootNameError = '故事名已经存在'
            return 0
          } else if (response.data === 'ok') {
            this.firstStep = false
            this.secondStep = true
            this.thirdStep = false
          }
        }).catch((err) => {
          console.log(err)
          this.rootNameError = '发生错误，请稍后再试'
        })
      },
      buildRoot () {
        if (this.rootContent) {
          if (this.rootContent.length > 180) {
            Toast({
              message: `您已超过最大字数${this.rootContent.length - 180}字`,
              position: 'middle',
              duration: 1000
            })
          } else {
            Axios.post('/story/buildRoot', {
              rootName: this.rootName,
              rootContent: this.rootContent,
              writePermit: this.writePermit
            }).then((response) => {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
              // 发布成功的处理
            })
          }
        } else {
          Toast({
            message: '内容不能为空',
            position: 'middle',
            duration: 1000
          })
        }
      }
    }
  }
</script>
