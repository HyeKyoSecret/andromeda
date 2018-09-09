<template>
  <div class="write-story">
    <div class="notice">
      <span class="icon" @click="closeWindow">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        续写&nbsp;{{title}}
      </span>
      <span class="fake-commit" v-if='!writeCheck'>发布</span>
      <span class="commit" @click="buildStory" v-else="">发布</span>
    </div>
    <div class="story-content">
      <textarea  name="context" placeholder="在这里书写您的故事" v-model="storyContent"></textarea>
    </div>
  </div>
</template>
<script>
  import { MessageBox, Toast } from 'mint-ui'
  import Axios from 'axios'
  export default {
    data () {
      return {
        writeCheck: false, // 允许发布
        storyContent: ''
      }
    },
    props: ['ftNode', 'title'],
    created: function () {
      this.loadDraft()
    },
    watch: {
      storyContent: function () {
        if (!this.storyContent) {
          this.writeCheck = false
          Toast({
            message: `内容不能为空`,
            position: 'middle',
            duration: 1000
          })
        } else {
          if (this.storyContent.length > 180) {
            this.writeCheck = false
            Toast({
              message: `您已超过最大字数${this.storyContent.length - 180}字`,
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
          this.$router.go(-1)
        })
      },
      closeWindow () {
        if (this.storyContent) {
          MessageBox.confirm('是否保存草稿?').then(action => {
            Axios.post('/story/saveStoryDraft', {
              id: this.ftNode,
              storyContent: this.storyContent
            }).then(response => {
              if (response.data.permit) {
                this.$emit('close')
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
                this.$emit('close')
              }
            })
          }).catch(error => {
            if (error) {
              this.$router.go(-1) // 离开的路由跳转
            }
          })
        } else {
          this.$emit('close')
        }
      },
      loadDraft () {
        Axios.get('/story/getStoryDraft', {
          params: {
            id: this.ftNode
          }
        }).then(response => {
          if (response.data) {
            this.storyContent = response.data
          }
        }).catch(err => {
          if (err) {
            Toast({
              message: '草稿载入失败',
              position: 'middle',
              duration: 1000
            })
          }
        })
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
