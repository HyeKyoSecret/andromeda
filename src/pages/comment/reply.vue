<template>
  <div class="reply">
    <div class="notice-title">
     <div class="cancel" @click="cancelReply">取消</div>
     <div class="reply-title">回复</div>
     <div class="submit" v-if="commentCheck" @click="submit">发送</div>
     <div class="submit-fake" v-else>发送</div>
    </div>
    <div class="text">
      <label for=""><textarea name="" id="comment" v-model.trim="comment" autofocus="autofocus"></textarea></label>
    </div>
  </div>
</template>
<script>
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        comment: ''
      }
    },
    computed: {
      commentCheck: function () {
        if (this.comment.length > 0 && this.comment.length <= 140) {
          this.fakeSubmit = false
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      comment: function () {
        if (this.comment && this.comment.length > 140) {
          Toast({
            position: 'middle',
            message: `已超过最大字数` + (this.comment.length - 140) + '字',
            duration: 1000
          })
        }
      }
    },
    methods: {
      cancelReply () {
        this.comment = ''
        this.$router.go(-1)
      },
      submit () {
        Axios.post('/comment/replyComment', {
          commentId: this.$route.params.id,
          content: this.comment
        }).then(response => {
          if (!response.data.error) {
            Toast({
              position: 'middle',
              message: response.data.message,
              duration: 1000
            })
            this.$router.go(-1)
          } else {
            Toast({
              position: 'middle',
              message: response.data.message,
              duration: 1000
            })
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .reply {
    position: absolute;
    width: 100%;
    top: 0;
    height: 100%;
    .notice-title {
      display: flex;
      height: 42px;
      width: 100%;
      background: $main-color;
      color: white;
      justify-content: center;
      align-items: center;
      text-align: center;
      .cancel {
        flex: 1;
        margin-left: 10px;
      }
      .reply-title {
        flex: 8;
      }
      .submit {
        flex: 1;
        margin-right: 10px;
      }
      .submit-fake {
        flex: 1;
        margin-right: 10px;
        color: $w-gray;
      }
    }
    .text {
      width: 100%;
      height: calc(100vh - 42px);
      textarea {
        width: 100%;
        height: 100%;
        overflow: hidden;
        outline: none;
        border: none;
        box-sizing: border-box;
        font-size: 14px;
        padding: 8px;
      }
    }
  }
</style>
