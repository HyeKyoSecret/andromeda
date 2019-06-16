<template>
  <div class="comment-page">
    <notice title="评论"></notice>
    <div class="main-comment" id="main" v-if="commentList.length !== 0">
      <div class="the-comment" >
        <div class="comment-content">
          <div class="critic-name">
            <div class="left"><img :src="commentList.headImg" alt="" @error="setError"></div>
            <div class="right"><span class="sub-critic">{{commentList.people}}</span></div>
          </div>
          <div class="content">
            {{commentList.content}}
          </div>
          <div class="information">
    <span class="thumb-up">
    <img src="../../img/icon/gray_thumb.png" v-if="!commentList.hasZan" @click="addZan(commentList.id, 'main')">
      <img src="../../img/icon/yellowthumb.png" v-else @click="cancelZan(commentList.id, 'main')">{{commentList.zan}}
    </span>
            <span class="time">{{commentList.date}}</span>
            <span class="reply" @click="replyComment(commentList.id, commentList.id, commentList.people)">回复</span>
            <span class="time" v-if="commentList.isYours">删除</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order" :style="{ 'top': mainHeight + 'px'}">
      <img src="../../img/icon/order.png" alt="" @click="changeOrder">
      <span v-if="order === 'time'" @click="changeOrder">按时间</span>
      <span v-else @click="changeOrder">按热度</span>
    </div>
    <div class="sub-comment" id='subContent' v-if="commentList.subComment" :style="{ 'marginTop': mainHeight + 35 +'px'}" >
      <div class="one-sub-comment" v-for="(item, index) in commentList.subComment" :id="item.id">
        <div class="sub-comment-content">
          <div class="sub-critic-name">
            <div class="left"><img :src="item.headImg" alt="" @error="setErrorImg(index)"></div>
            <div class="right"><span class="sub-critic">{{item.people}}</span></div>
          </div>
          <div class="sub-content">
            <span>回复 {{item.commentTo}} :</span> {{item.content}}
          </div>
          <div class="sub-information">
            <span class="sub-thumb-up">
              <img src="../../img/icon/gray_thumb.png" v-if="!item.hasZan" @click="addZan(item.id, 'sub', index)">
                <img src="../../img/icon/yellowthumb.png" v-else @click="cancelZan(item.id, 'sub', index)">{{item.zan}}
              </span>
            <span class="sub-time">{{item.date}}</span>
            <span class="sub-reply" @click="replyComment(commentList.id, item.id, item.people)">回复</span>
            <span class="sub-time" v-if="item.isYours" @click="deleteComment(item.id)">删除</span>
          </div>
        </div>
      </div>
      <div class="blank"></div>
    </div>
    <div class="comment-input">
      <textarea id="textArea" v-model="comment" rows="1" :placeholder="tempPlaceHolder" @focus="showButton"></textarea>
      <span class="fake submit" v-if="fakeSubmit && !commentCheck">发送</span>
      <span class="submit" v-if="commentCheck" @click="submitComment(toId, mainId)">发送</span>
    </div>
    <blank v-if="commentList.length === 0"></blank>
  </div>
</template>
<script>
  import Axios from 'axios'
  import { Toast, MessageBox } from 'mint-ui'
  import notice from '../../components/notice/notice.vue'
  import blank from '../../components/blank/blank.vue'
  export default {
    components: {
      blank,
      notice
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
    data () {
      return {
        id: this.$route.params.id,
        commentList: [],
        order: 'time',
        comment: '',
        tempPlaceHolder: '',
        toId: '',
        mainId: this.$route.params.id,
        fakeSubmit: false,
        mainHeight: '',
        subWidth: ''
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getSize () {
        this.$nextTick(function () {
          this.mainHeight = document.getElementById('main').clientHeight + 41
        })
      },
      showButton () {
        this.fakeSubmit = true
      },
      replyComment (main, to, people) {
        this.comment = ''
        this.toId = to
        this.mainId = main
        document.getElementById('textArea').focus()
        this.tempPlaceHolder = `回复${people} : `
      },
      submitComment (to, mainId) {
        if (!mainId) {
          mainId = this.$route.params.id
        }
        if (!to) {
          to = this.$route.params.id
        }
        Axios.post('/comment/addComment', {
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
          this.getData()
        })
      },
      changeOrder () {
        if (this.order === 'hot') {
          this.order = 'time'
          this.bubbleSort(this.commentList)
        } else {
          this.order = 'hot'
          this.bubbleSort(this.commentList)
        }
      },
      setError () {
        this.commentList.headImg = require('../../img/images/defaultHeadImg.png')
      },
      setErrorImg (i) {
        this.commentList.subComment[i].headImg = require('../../img/images/defaultHeadImg.png')
      },
      getData () {
        Axios.get('/comment/commentDetails', {
          params: {
            id: this.id
          }
        }).then(response => {
          if (!response.data.error) {
            this.commentList = this.bubbleSort(response.data.result)
            this.tempPlaceHolder = `回复${this.commentList.people} : `
            this.getSize()
          } else {
            this.$emit('error')
          }
        })
      },
      bubbleSort (list) {   // 排序算法，从大到小
        let arr = list.subComment
        if (this.order === 'time') {
          for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - 1 - i; j++) {
              if (arr[j]['timeStamp'] < arr[j + 1]['timeStamp']) {
                let tmp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = tmp
              }
            }
          }
          list.subComment = arr.reverse() // 颠倒顺序
          return list
        } else {
          for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - 1 - i; j++) {
              if (arr[j]['zan'] < arr[j + 1]['zan']) {
                let tmp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = tmp
              }
            }
          }
          list.subComment = arr
          return list
        }
      },
      addZan (id, type, i) {
        Axios.post('/comment/addZan', {
          id: id
        }).then(response => {
          if (!response.data.error) {
            if (type === 'main') {
              this.commentList.hasZan = true
              this.commentList.zan += 1
            } else if (type === 'sub') {
              this.commentList.subComment[i].hasZan = true
              this.commentList.subComment[i].zan += 1
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
      cancelZan (id, type, i) {
        Axios.post('/comment/cancelZan', {
          id: id
        }).then(response => {
          if (!response.data.error) {
            if (type === 'main') {
              this.commentList.hasZan = false
              this.commentList.zan -= 1
            } else if (type === 'sub') {
              this.commentList.subComment[i].hasZan = false
              this.commentList.subComment[i].zan -= 1
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
      deleteComment (id) {
        MessageBox({
          title: '提示',
          message: '确定删除本条评论吗?',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            Axios.post('/comment/deleteComment', {
              storyId: this.$route.params.id,
              type: 'sub',
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
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  .comment-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: calc(100vh - 40px);
    background: $bg-gray;
    .main-comment {
      width: 100%;
      margin: 42px auto 0 auto;
      background: white;
      position: fixed;
      top: 0;
      .the-comment {
        &:last-child {
          border-bottom: none !important;
        }
        display: flex;
        padding: 10px 10px 10px 0;
        .comment-content {
          width: 95%;
          margin: 0 auto;
          color: $font-dark;
          align-items: center;
          .critic-name {
            display: flex;
            height: 40px;
            .left {
              flex: 1;
              img {
                width: 35px;
              }
            }
            .right {
              font-weight: 600;
              line-height: 35px;
              flex: 15;
              margin-left: 10px;
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
          .information {
            margin-top: 8px;
            height: 18px;
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
              margin-top: 2px;
              color: $main-color;
            }
          }
        }
      }
    }
    @media (min-width: 768px) {
      .main-comment {
        max-width: 700px;
      }
    }
    .order {
      position: fixed;
      width: 100%;
      background: $content-gray;
      height: 35px;
      line-height: 35px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 13px;
      color: $icon-blue;
      span {
        display: inline-block;
        margin-right: 10px;
      }
      img {
        margin-right: 5px;
        width: 15px;
        height: 15px;
      }
    }
    @media (min-width: 768px) {
      .order {
        max-width: 700px;
      }
    }
    .sub-comment {
      width: 92%;
      margin-left: auto;
      margin-right: auto;
      background: $content-gray;
      .blank {
        height: 80px;
        width: 100%;
        background: $bg-gray;
      }
    .one-sub-comment {
      border-top: 1px solid $border-gray;
      background-color: $content-gray;
      &:last-child {
        border-bottom: none !important;
      }
      display: flex;
      padding: 10px 10px 10px 0;
      .sub-comment-content {
        width: 95%;
        margin: 0 auto;
        color: $font-dark;
        align-items: center;
        .sub-critic-name {
          display: flex;
          .left {
            flex: 1;
            font-weight: 600;
            img {
              width: 25px;
            }
          }
          .right {
            line-height: 25px;
            flex: 15;
            margin-left: 10px;
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
            display: inline-block;
            margin-top: 2px;
            color: $main-color;
          }
        }
      }
    }
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
