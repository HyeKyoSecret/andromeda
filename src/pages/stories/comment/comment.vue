<template>
  <div class="comment">
    <notice title="评论"></notice>
    <div class="comment-number">
      评论（{{commentList.length}}）
    </div>
    <div class="all-comment">
      <article class="one-comment" v-for="(item, index) in commentList" :name="item.id" :key="item.id.toString()">
        <div class="critic-pic">
          <img :src="item.headImg" @error="setErrorImg(index)">
        </div>
        <div class="comment-content">
          <div class="critic-name">
            <span class="critic">{{item.people}}</span>
            <span class="to" v-if="item.commentTo">
              <img src="../../../img/icon/gray_triangle.png">
            </span>
            <span class="re-critic" v-if="item.commentTo">{{item.commentTo}}</span>
          </div>
          <div class="content" :class="{notshow: commentList[index].notShow}">
            {{item.content}}
          </div>
          <div class="information">
            <span class="thumb-up" >
              <img src="../../../img/icon/gray_thumb.png" v-if="!item.hasZan" @click="addZan(item.id, 'main', index)">
              <img src="../../../img/icon/yellowthumb.png" v-else @click="cancelZan(item.id, 'main', index)">{{item.zan}}
            </span>
            <span class="time">{{item.date}}</span>
            <span class="reply" @click="replyComment(item.id, item.id, item.people)">回复</span>
            <span class="time" v-if="item.isYours" @click="deleteComment('main', item.id)">删除</span>
            <!--<span class="showBtn" v-if="item.lc > 3" @click="showComment(index)">{{item.notShow ? '展开' : '收起'}}</span>-->
            <span class="showBtn" @click=goComment(item.id) v-if="item.subComment && item.subComment > 0">共{{item.subComment}}条评论 ></span>
          </div>
      </div>
    </article>
      <div class="blank"></div>
    </div>
    <div class="comment-input">
      <textarea id="textArea" v-model="comment" rows="1" :placeholder="tempPlaceHolder" @focus="showButton" @blur="scrollBottom"></textarea>
      <span class="fake submit" v-if="fakeSubmit && !commentCheck">发送</span>
      <span class="submit" v-if="commentCheck" @click="submitComment(toId, mainId)">发送</span>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/style.css";
  @import "../../../scss/config";
  .comment {
    position: absolute;
    top: 0;
    left: 0;
    min-height: calc(100vh - 40px);
    width: 100%;
    background: white;
    margin-top: 40px;
    z-index: 901;
    .comment-number {
      font-size: 14px;
      color: $font-gray;
      padding-left: 20px;
      height: 30px;
      background-color: $content-gray;
      vertical-align: middle;
      line-height: 30px;
      font-weight: 800;
    }
    .all-comment {
      .one-comment {
        background-color: white;
        padding: 10px 10px 0 10px;
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
          border-bottom: 1px solid $bg-gray;
          .critic-name {
            font-size: 13px;
            font-weight: 600;
            img {
              height: 10px;
              width: 10px;
            }
          }
          .content{
            line-height: 18px;
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
              display: inline-block;
              margin-top: 7px;
              color: $main-color;
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
    @media (min-width: 768px) {
      .comment-input {
        max-width: 700px;
      }
    }
  }
</style>
<script>
  import notice from '../../../components/notice/notice.vue'
  import Axios from 'axios'
  import autoSize from 'autosize'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        name: this.$route.path.split('/'),
        comment: '',
        fakeSubmit: false,
        submit: false,
        commentList: [],
        toId: '',  // 回复的具体对象，
        mainId: '', // 回复的主对象
        author: '',
        tempPlaceHolder: '写下你的评论。。。',
        position: '',
        jump: true
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
    mounted: function () {
      autoSize(document.querySelectorAll('textarea'))
    },
    created: function () {
      this.getData()
    },
    // beforeRouteEnter (to, from, next) {
    //   next(vm => {
    //     vm.position = to.hash.split('#')[1]
    //   })
    // },
    methods: {
      scrollBottom () {
        window.scrollTo(0, document.documentElement.clientHeight)
      },
      goComment (id) {
        this.$router.push(`/comment/${id}`)
      },
      deleteComment (type, id, index) {
        if (type === 'main') {
          MessageBox({
            title: '提示',
            message: '删除评论将连带删除关于本条的所有评论，您确定这样做吗?',
            showCancelButton: true
          }).then(action => {
            if (action === 'confirm') {
              Axios.post('/comment/deleteComment', {
                storyId: this.$route.params.id,
                type: type,
                id: id
              }).then(response => {
                if (!response.data.error) {
                  this.getData()
                  Toast({
                    position: 'middle',
                    message: response.data.message,
                    duration: 1000
                  })
                } else {
                  Toast({
                    position: 'middle',
                    message: response.data.message,
                    duration: 1000
                  })
                }
              })
            }
          }).catch(e => {
            return false
          })
        } else if (type === 'sub') {
          MessageBox({
            title: '提示',
            message: '确定删除本条评论吗?',
            showCancelButton: true
          }).then(action => {
            if (action === 'confirm') {
              Axios.post('/comment/deleteComment', {
                storyId: this.$route.params.id,
                type: type,
                id: id
              }).then(response => {
                if (!response.data.error) {
                  this.getData()
                  Toast({
                    position: 'middle',
                    message: response.data.message,
                    duration: 1000
                  })
                } else {
                  Toast({
                    position: 'middle',
                    message: response.data.message,
                    duration: 1000
                  })
                }
              })
            }
          }).catch(e => {
            return false
          })
        }
      },
      addZan (id, type, i, j) {
        Axios.post('/comment/addZan', {
          id: id
        }).then(response => {
          if (!response.data.error) {
            if (type === 'main') {
              this.commentList[i].hasZan = true
              this.commentList[i].zan += 1
            } else if (type === 'sub') {
              this.commentList[i].subComment[j].hasZan = true
              this.commentList[i].subComment[j].zan += 1
            }
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
      cancelZan (id, type, i, j) {
        Axios.post('/comment/cancelZan', {
          id: id
        }).then(response => {
          if (!response.data.error) {
            if (type === 'main') {
              this.commentList[i].hasZan = false
              this.commentList[i].zan -= 1
            } else if (type === 'sub') {
              this.commentList[i].subComment[j].hasZan = false
              this.commentList[i].subComment[j].zan -= 1
            }
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
          this.comment = ''
          document.getElementById('textArea').style.height = 28 + 'px'
          this.toId = ''
          this.mainId = ''
          this.tempPlaceHolder = '写下你的评论。。。'
          this.getData()
          window.scrollTo(0, document.documentElement.clientHeight)
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
            // this.$nextTick(function () {
            //   for (let i = 0; i < this.commentList.length; i++) {
            //     let f = document.getElementById(this.commentList[i].id)
            //     this.commentList[i].lc = this.countLines(f)
            //     if (this.commentList[i].lc > 3) {
            //       this.commentList[i].notShow = true
            //       this.$set(this.commentList, i, this.commentList[i])
            //     }
            //   }
            //   this.commentList.forEach(comment => {
            //     if (comment.lc > 3) {
            //       comment.notShow = true
            //     }
            //   })
            // }.bind(this))

            this.commentList = response.data.result
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
      replyComment (main, to, people) {
        this.comment = ''
        this.toId = to
        this.mainId = main
        document.getElementById('textArea').focus()
        this.tempPlaceHolder = `回复${people} :`
      },
      setErrorImg (x) {
        this.commentList[x].headImg = require('../../../img/images/defaultHeadImg.png')
      }
    },
    components: {
      notice
    }
  }
</script>
