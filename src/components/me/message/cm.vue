<template>
    <div class="cm">
      <notice title="评论消息"></notice>
      <mt-loadmore :top-method="loadTop" class="my-creation-content" ref="loadmore"
                   infinite-scroll-disabled = true
                   infinite-scroll-distance = "10"
                   v-if="commentList.length">
        <div class="cm-content" v-for="(item, index) in commentList">
          <div class="user">
            <div class="head">
              <img :src="item.peopleHead" alt="" @error="setErrorImg(index)" @click="goPeople(item.peopleId)">
            </div>
            <div class="info">
              <div class="name" @click="goPeople(item.peopleId)">{{item.people}}</div>
              <div class="date">{{item.date}}</div>
            </div>
            <div class="reply">
              <span @click="goReply(item.commentId)">回复</span>
            </div>
          </div>
          <div class="comment-content" @click="goComment(item.type, item.subId, item.commentId)">
            <span class="word" v-if="item.type === 'comment'">回复</span>
            <span class="at" v-if="item.type === 'comment'">@{{item.commentTo}}</span>
            <span class="content">{{item.commentContent}}</span>
          </div>
          <div class="former-comment" v-if="item.type === 'comment'">
            <span class="at">{{item.people}}</span>
            <span class="word">回复</span>
            <span class="at">{{item.commentTo}}</span>
            <span class="content">{{item.commentContent}}</span>
          </div>
          <div class="comment-theme" @click="goStory(item.subId)">
            <div class="left">
              <img :src="item.coverImg" alt="">
            </div>
            <div class="right">
              <div class="people">@{{item.subPeople}}</div>
              <div class="story-content">
                {{item.subContent}}
              </div>
            </div>
          </div>
        </div>
        <div class="blank"></div>
      </mt-loadmore>
      <blank v-if="!commentList.length"></blank>
    </div>
</template>
<script>
  import notice from '../../notice/notice'
  import blank from '../../blank/blank'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    name: 'cm',
    components: {
      notice,
      blank
    },
    data () {
      return {
        commentList: []
      }
    },
    created: function () {
      this.getData()
      this.changeReadState()
    },
    methods: {
      loadTop () {
        this.getData()
        this.$refs.loadmore.onTopLoaded()
      },
      goReply (id) {
        this.$router.push('/reply/' + id)
      },
      goStory (id) {
        this.$router.push(`/story/${id}`)
      },
      goPeople (id) {
        this.$router.push(`/people/${id}`)
      },
      goComment (type, story, id) {
        if (type !== 'comment') {
          this.$router.push(`/story/${story}/comment#${id}`)
        } else {
          Axios.post('/comment/getMainId', {
            story: story,
            id: id
          }).then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              this.$router.push(`/comment/${response.data.mainId}`)
            }
          })
        }
      },
      setErrorImg (x) {
        this.commentList[x].peopleHead = require('../../../img/images/defaultHeadImg.png')
      },
      getData () {
        Axios.get('/comment/getMessageComment')
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              this.commentList = response.data.result
            }
          })
      },
      changeReadState () {
        Axios.post('/comment/changeReadState')
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            }
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../scss/config";
  @import "../../../scss/style.css";
  .cm {
    position: absolute;
    z-index: 997;
    top: 0;
    left: 0;
    width: 100%;
    min-height: calc(100vh - 100px);
    background: $bg-gray;
    .my-creation-content {
      margin-top: 46px;
    }
    .cm-content {
      width: 96%;
      margin: 0 auto;
      margin-top: 10px;
      box-sizing: content-box;
      background: $content-gray;
      .user {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        background: white;
        .head {
          flex: 1;
          img {
            width: 35px;
          }
        }
        .info {
          flex: 20;
          margin-left: 10px;
          color: $font-dark;
          .date {
            color: $font-gray;
          }
        }
        .reply {
          flex: 1;
          justify-content: flex-end;
          span {
            width: 40px;
            height: 25px;
            display: inline-block;
            color: $font-gray;
            border: 1px solid $font-gray;
            text-align: center;
            line-height: 25px;
          }
        }
      }
    }
    .comment-content {
      background: white;
      font-size: 13px;
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      -moz-box-orient: vertical;
      -moz-line-clamp: 2;
      overflow: hidden;
      max-height: 42px;
      min-height: 25px;
      padding-left: 10px;
      padding-right: 10px;
      line-height: 20px;
      .at {
        color: $icon-blue
      }
    }
    .former-comment {
      background: $content-gray;
      box-sizing: border-box;
      padding: 8px 10px 8px 10px;
      font-size: 13px;
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      -moz-box-orient: vertical;
      -moz-line-clamp: 2;
      overflow: hidden;
      min-height: 25px;
      max-height: 50px;
      line-height: 20px;
      .at {
        color: $icon-blue
      }
    }
    .comment-theme {
      padding: 10px;
      display: flex;
      .left {
        flex: 1;
        width: 48px;
        height: 64px;
        img {
          width: 48px;
          height: 64px;
        }
      }
      .right {
        flex: 35;
        padding-left: 8px;
        background: white;
        .people {
          color: $font-dark;
          margin-top: 3px;
        }
        .story-content {
          display: -moz-box;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          -moz-box-orient: vertical;
          -moz-line-clamp: 2;
          overflow: hidden;
          color: $font-gray;
          font-size: 12px;
        }
      }
    }
    .blank {
      width: 100%;
      height: 100px;
    }
  }
</style>
