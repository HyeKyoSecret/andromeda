<template>
  <div class="comment">
    <notice title="评论"></notice>
    <div class="comment-number">
      评论（{{commentList.length}}）
    </div>
    <div class="all-comment">
      <div class="one-comment" v-for="(item, index) in commentList">
        <div class="critic-pic">
          <img :src="item.headImg" @error="setErrorImg(index)">
        </div>
        <div class="comment-content">
          <div class="critic-name">
            <span class="critic">{{item.people}}</span>
            <span class="to" v-if="item.commentTo">
              <img src="../../img/icon/gray_triangle.png">
            </span>
            <span class="re-critic" v-if="item.commentTo">{{item.commentTo}}</span>
          </div>
          <div class="content" :class="{notshow: commentList[index].notShow}":id="item.id">
            {{item.content}}
          </div>
          <div class="information">
            <span class="thumb-up" >
              <img src="../../img/icon/gray_thumb.png" v-if="!item.hasZan" @click="addZan(index)">
              <img src="../../img/icon/yellowthumb.png" v-else @click="cancelZan(index)">{{item.zan}}
            </span>
            <span class="reply" @click="replyComment(item.id, item.id)">回复</span>
            <span class="time">{{item.date}}</span>
            <span class="showBtn" v-if="item.lc > 3" @click="showComment(index)">{{item.notShow ? '展开' : '收起'}}</span>
          </div>
          <div class="sub-comment">
            <div class="one-sub-comment" v-for="q in item.subComment">
              <div class="sub-comment-content">
                <div class="sub-critic-name">
                  <span class="sub-critic">{{q.people}}</span>
                  <span class="sub-to">
              <img src="../../img/icon/gray_triangle.png">
            </span>
                  <span class="sub-re-critic">{{q.commentTo}}</span>
                </div>
                <div class="sub-content">
                  {{q.content}}
                </div>
                <div class="sub-information">
            <span class="sub-thumb-up" >
              <img src="../../img/icon/gray_thumb.png">
              <img src="../../img/icon/yellowthumb.png">
            </span>
                  <span class="sub-reply" @click="replyComment(item.id, q.id)">回复</span>
                  <span class="sub-time">{{q.date}}</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
      <div class="blank"></div>
    </div>
    <div class="comment-input">
      <textarea id="textArea" v-model="comment" rows="1" placeholder="写下你的评论。。。" @focus="showButton"></textarea>
      <span class="fake submit" v-if="fakeSubmit && !commentCheck">发送</span>
      <span class="submit" v-if="commentCheck" @click="submitComment(toId, mainId)">发送</span>
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
    min-height: calc(100vh - 42px);
    width: 100%;
    background: white;
    margin-top: 42px;
    z-index: 901;
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
        padding: 10px 10px 0 10px;
        border-top: 1px solid $line-gray;
        &:first-child{
          border: none;
        }
        .critic-pic {
          display: inline-block;
          width: 13%;
          height: 100%;
          text-align: center;
          vertical-align: top;
          img {
            width: 48px;
            height: 48px;
          }
        }
        .comment-content {
          width: 80%;
          display: inline-block;
          margin-left: 10px;
          color: $font-dark;
          .critic-name {
            font-size: 13px;
            font-weight: 600;
            img {
              height: 10px;
              width: 10px;
            }
          }
          .content{
            font-size: 13px;
            color: $font-dark;
            margin-top: 5px;
            word-break: break-all;
            overflow: visible;
            max-height: 300px;
            display: inline-block;
          }
          .content.notshow {
            font-size: 13px;
            color: $font-dark;
            margin-top: 5px;
            max-height: 60px;
            word-break: break-all;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            -moz-box-orient: vertical;
            -moz-line-clamp: 3;
            overflow: hidden;
          }
          .information {
            margin-top: 10px;
            height: 30px;
            line-height: 30px;
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
            .showBtn {
              float: right;
              color: $main-color;
            }
          }
        }
        .sub-comment {
          .one-sub-comment {
            &:last-child {
              border-bottom: none !important;
            }
            border-top: 1px solid $line-gray;
            background-color: white;
            display: flex;
            padding: 10px 10px 10px 0;
            .sub-comment-content {
              flex: 8;
              color: $font-dark;
              .sub-critic-name {
                font-size: 13px;
                font-weight: 600;
                img {
                  height: 8px;
                  width: 8px;
                }
              }
              .sub-content{
                font-size: 13px;
                color: $font-dark;
                margin-top: 5px;
                word-break: break-all;
                overflow: visible;
                max-height: 300px;
                display: inline-block;
              }
              .sub-content.notshow {
                font-size: 13px;
                color: $font-dark;
                margin-top: 5px;
                max-height: 60px;
                word-break: break-all;
                display: -webkit-box;
                display: -moz-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                -moz-box-orient: vertical;
                -moz-line-clamp: 3;
                overflow: hidden;
              }
              .sub-information {
                margin-top: 8px;
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
                .sub-showBtn {
                  float: right;
                  color: $main-color;
                }
              }
            }
          }
        }
      }
      .blank {
        width: 100%;
        height: 75px;
        background: white;
      }
    }
    &:last-child .comment-content {
      border: none;
    }
    .comment-input {
      position: fixed;
      bottom: 0;
      border-top: 1px solid $border-gray;
      width: 100%;
      max-width: 700px;
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
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        comment: '',
        fakeSubmit: false,
        submit: false,
        commentList: [],
        toId: '',  // 回复的具体对象，
        mainId: '', // 回复的主对象
        author: ''
      }
    },
    computed: {
      commentCheck: function () {
        if (this.comment.length > 0 && this.comment.length <= 160) {
          this.fakeSubmit = false
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      comment: function () {
        if (this.comment && this.comment.length > 160) {
          Toast({
            position: 'middle',
            message: `已超过最大字数` + (this.comment.length - 160) + '字',
            duration: 1000
          })
        }
        // if (!this.tempWord || this.tempWord !== `${this.comment.split('：')[0]}：`) {   // 检查是否有回复人
        //   this.tempWord = ''
        //   this.toId = ''
        //   this.mainId = ''
        // }
      }
    },
    mounted: function () {
      autoSize(document.querySelectorAll('textarea'))
    },
    created: function () {
      this.getData()
    },
    methods: {
      showComment (i) {
        this.commentList[i].notShow = !this.commentList[i].notShow
        this.$set(this.commentList, i, this.commentList[i])
      },
      addZan (i) {
        Axios.post('/comment/addZan', {
          id: this.commentList[i].id
        }).then(response => {
          if (!response.data.error) {
            this.commentList[i].hasZan = true
            this.commentList[i].zan += 1
          } else {
            if (response.data.askLogin) {
              MessageBox({
                title: '提示',
                message: '确定前往登录吗?',
                showCancelButton: true
              }).then(action => {
                this.$router.push('/login')
              }).catch(e => {
                return 0
              })
            } else {
              Toast({
                position: 'middle',
                message: response.data.message,
                duration: 1000
              })
            }
          }
        })
      },
      cancelZan (i) {
        Axios.post('/comment/cancelZan', {
          id: this.commentList[i].id
        }).then(response => {
          if (!response.data.error) {
            this.commentList[i].hasZan = false
            this.commentList[i].zan -= 1
          } else {
            if (response.data.askLogin) {
              MessageBox({
                title: '提示',
                message: '确定前往登录吗?',
                showCancelButton: true
              }).then(action => {
                this.$router.push('/login')
              }).catch(e => {
                return 0
              })
            } else {
              Toast({
                position: 'middle',
                message: response.data.message,
                duration: 1000
              })
            }
          }
        })
      },
      showButton () {
        this.fakeSubmit = true
      },
      submitComment (to, mainId) {
        Axios.post('/comment/storyComment', {
          id: this.$route.params.id,
          content: this.comment,
          to: to,
          main: mainId
        }).then(response => {
          Toast({
            position: 'middle',
            message: response.data.message,
            duration: 1000
          })
          this.getData()
          this.comment = ''
          document.getElementById('textArea').style.height = 28 + 'px'
          this.toId = ''
          this.mainId = ''
        })
      },
      countLines (ele) {
        let styles = window.getComputedStyle(ele, null)
        let lh = parseInt(styles.lineHeight, 10)
        let h = parseInt(styles.height, 10)
        return Math.round(h / lh)
      },
      getData () {
        Axios.get('/comment/getComment', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          if (!response.data.error) {
            this.commentList = response.data.result
            this.$nextTick(function () {
              for (let i = 0; i < this.commentList.length; i++) {
                let f = document.getElementById(this.commentList[i].id)
                this.commentList[i].lc = this.countLines(f)
                if (this.commentList[i].lc > 3) {
                  this.commentList[i].notShow = true
                  this.$set(this.commentList, i, this.commentList[i])
                }
              }
              this.commentList.forEach(comment => {
                if (comment.lc > 3) {
                  comment.notShow = true
                }
              })
            }.bind(this))
            this.author = response.data.author
          } else {
            Toast({
              position: 'middle',
              message: response.data.message,
              duration: 1000
            })
          }
        })
      },
      replyComment (main, to) {
        this.comment = ''
        this.toId = to
        this.mainId = main
        document.getElementById('textArea').focus()
      },
      setErrorImg (x) {
        this.commentList[x].headImg = require('../../img/images/defaultHeadImg.png')
      }
    },
    components: {
      notice
    }
  }
</script>
