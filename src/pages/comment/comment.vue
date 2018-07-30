<template>
  <div class="comment">
    <notice title="评论"></notice>
    <div class="comment-number">
      评论（874）
    </div>
    <div class="all-comment">
      <div class="one-comment">
        <div class="critic-pic">
          <img src="../../img/photo/2b_head.png">
        </div>
        <div class="comment-content">
          <div class="critic-name">
            <span class="critic">2B</span>
            <span class="to">
              <img src="../../img/icon/gray_triangle.png">
            </span>
            <span class="re-critic">9S</span>
          </div>
          <div class="content">
            9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。
          </div>
          <div class="information">
            <span class="thumb-up">
              <img src="../../img/icon/gray_thumb.png">119
            </span>
            <span class="reply">回复</span>
            <span class="time">03/01</span>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-input">
      <textarea v-model="comment" rows="1" placeholder="写下你的评论。。。" @focus="showButton"></textarea>
      <span class="fake submit" v-if="fakeSubmit && !commentCheck">发送</span>
      <span class="submit" v-if="commentCheck" @click="submitComment()">发送</span>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .comment {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: white;
    .comment-number {
      font-size: 14px;
      color: $font-gray;
      padding-left: 20px;
      height: 30px;
      background-color: $bg-gray;
      vertical-align: middle;
      line-height: 30px;
      font-weight: 800;
    }
    .all-comment {
      .one-comment {
        background-color: white;
        display: flex;
        padding: 10px 10px 10px 10px;

        .critic-pic {
          flex: 1;
          img {
            width: 50px;
            height: 50px;
          }
        }
        .comment-content {
          flex: 8;
          margin-left: 10px;
          color: $font-dark;
          border-bottom: 1px solid $line-gray;
          .critic-name {
            font-size: 16px;
            font-weight: 800;
            img {
              height: 10px;
              width: 10px;
            }
          }
          .content {
            font-size: 14px;
            color: $font-dark;
            margin-top: 5px;
          }
          .information {
            margin-top: 10px;
            margin-bottom: 10px;
            span {
              height: 14px;
              line-height: 14px;
              color: $font-gray;
              margin-right: 5px;
              img {
                margin-right: 5px;
                height: 14px;
                width: 14px;
              }
            }
          }
        }
      }
    }
    &:last-child .comment-content {
      border: none;
    }
    .comment-input {
      position: absolute;
      bottom: 0;
      border-top: 1px solid $border-gray;
      width: 100%;
      min-height: 50px;
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        width: 95%;
        outline: none;
        border: 1px solid $border-gray;
        max-height: 160px;
        min-height: 28px;
        border-radius: 2px;
        padding-left: 5px;
        -webkit-appearance: none;
        font-size: 15px;
        line-height: 28px;
        margin: 5px;

      }
      .fake.submit {
        background: white;
        color: $w-gray;
        font-weight: 500;
      }
      .submit {
        background: white;
        color: $main-color;
        font-weight: 600;
        text-align: center;
        width: 40px;
        height: 25px;
        border: 1px solid $border-gray;
        margin-top: -5px;
        margin-left: 6px;
        margin-right: 5px;
        border-radius: 1px;
        font-size: 14px;
        line-height: 25px;
      }
    }
  }
</style>
<script>
  import notice from '../../components/notice/notice.vue'
  import Axios from 'axios'
  import autoSize from 'autosize'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        comment: '',
        fakeSubmit: false,
        submit: false,
        commentList: []
      }
    },
    computed: {
      commentCheck: function () {
        if (this.comment.length > 0 && this.comment.length <= 180) {
          this.fakeSubmit = false
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      comment: function () {
        if (this.comment && this.comment.length > 180) {
          Toast({
            position: 'middle',
            message: `已超过最大字数` + (this.comment.length - 180) + '字',
            duration: 1000
          })
        }
      }
    },
    mounted: function () {
      autoSize(document.querySelectorAll('textarea'))
    },
    created: function () {
      this.getData()
    },
    methods: {
      showButton () {
        this.fakeSubmit = true
      },
      submitComment (to) {
        Axios.post('/comment/storyComment', {
          id: this.$route.params.id,
          content: this.comment,
          to: to
        }).then(response => {
          Toast({
            position: 'middle',
            message: response.data.message,
            duration: 1000
          })
        })
      },
      getData () {
        Axios.get('/comment/getComment', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          if (!response.data.error) {
            this.commentList = response.data.result
          } else {
            Toast({
              position: 'middle',
              message: response.data.message,
              duration: 1000
            })
          }
        })
      }
    },
    components: {
      notice
    }
  }
</script>
