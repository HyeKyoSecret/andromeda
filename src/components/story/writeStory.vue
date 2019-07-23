<template>
  <div class="write-story">
    <div class="notice">
      <span class="icon" @click="closeWindow">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        续写&nbsp;{{title}}
      </span>
      <span class="fake-commit" v-if='!writeCheck' @click="showFailReason">发布</span>
      <span class="commit" @click="buildStory" v-else="">发布</span>
    </div>
    <div class="story-content">
      <textarea  id="context" name="context" placeholder="在这里续写故事" v-model="storyContent"></textarea>
    </div>
  </div>
</template>
<script>
  import { Toast } from 'mint-ui'
  import Axios from 'axios'
  export default {
    data () {
      return {
        writeCheck: false, // 允许发布
        storyContent: ''
      }
    },
    props: ['ftNode', 'title'],
    watch: {
      storyContent: function () {
        var tmp = document.querySelector('#context').value
        var lines = tmp.split(/\r*\n/)
        var linesCount = lines.length
        if (!this.storyContent) {
          this.writeCheck = false
          Toast({
            message: `内容不能为空`,
            position: 'middle',
            duration: 1000
          })
        } else {
          if (this.storyContent.length > 240) {
            this.writeCheck = false
            Toast({
              message: `您已超过最大字数${this.storyContent.length - 240}字`,
              position: 'middle',
              duration: 1000
            })
          } else if (linesCount > 14) {
            this.writeCheck = false
            Toast({
              message: `行数超过限制`,
              position: 'middle',
              duration: 1000
            })
          } else {
            this.writeCheck = true
          }
        }
      }
    },
    methods: {
      showFailReason () {
        if (!this.storyContent) {
          Toast({
            message: `内容不能为空`,
            position: 'middle',
            duration: 1000
          })
        } else {
          var tmp = document.querySelector('#context').value
          var lines = tmp.split(/\r*\n/)
          var linesCount = lines.length - (navigator.userAgent.indexOf('MSIE') !== -1)
          if (this.storyContent.length > 240) {
            Toast({
              message: `您已超过最大字数${this.storyContent.length - 240}字`,
              position: 'middle',
              duration: 1000
            })
          } else if (linesCount > 14) {
            Toast({
              message: `行数超过限制`,
              position: 'middle',
              duration: 1000
            })
          }
        }
      },
      buildStory: function () {
        Axios.post('/story/buildStory', {
          ftNode: this.ftNode,
          content: this.storyContent
        }).then((response) => {
          Toast({
            message: response.data.message,
            position: 'middle',
            duration: 1000
          })
          if (response.data.storyId) {
            this.closeWindow()
            this.$router.push(`/story/${response.data.storyId}`)
          } else {
            this.$router.go(-1)
          }
        })
      },
      closeWindow () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .write-story {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    .notice {
      width: 100%;
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
        left: 0;
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
    .story-content {
      width: 100%;
      display:flex;
      align-items: center;
      justify-content: center;
      textarea {
        height: calc(100vh - 50px);
        width: 100%;
        border: none;
        outline: none;
        font-size: 16px;
        padding: 5px;
      }
    }
  }
</style>
