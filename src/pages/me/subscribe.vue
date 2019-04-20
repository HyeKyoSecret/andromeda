<template>
  <div class="subscribe">
    <notice :title="title"></notice>
    <div class="show-story" v-if="subList.length">
      <div class="background">
        <div class="left-part"><img :src="cover.coverImg" @click="goStory(cover.latest)" @error="setCoverErrorImg"/></div>
        <div class="right-part">
          <div class="already-read">
              <img src="../../img/icon/already_read.png" />
              <div class="read-amount">{{cover.readPercent}}</div>
          </div>
          <div class="story-name">{{cover.name}}</div>
          <div class="quantity">
            <img src="../../img/icon/gray_flag.png" />
            <div class="amount">{{cover.nodeNum}} 篇</div>
          </div>
          <div class="quantity">
           <img src="../../img/icon/gray_book.png"/>
            <div class="amount">{{cover.follower}} 人</div>
          </div>
          <div class="quantity">
            <img src="../../img/icon/gray_pen.png" />
            <div class="amount">{{cover.myCreation}} 篇</div>
          </div>
          <div class="continue-read" @click="goStory(cover.latest)">
            继续阅读
          </div>
        </div>
      </div>
    </div>
    <div class="shelf" v-for="(item, index) in contentList" v-if="subList.length">
      <div class="book" v-for="(q, index2) in item" @click="changeCover(q)">
        <div class="cover"><img :src="q.coverImg" @error="setErrorImg(index, index2)"/></div>
        <div class="progress-bar" v-bind:style="{ width: q.readPercent * 3 / 5 + '%'}"></div>
        <div class="name">{{q.name}}</div>
      </div>
    </div>
    <blank v-if="!subList.length"></blank>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
  .subscribe {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: $bg-gray;
    .show-story {
      margin: 20px auto 0 auto;
      width: 90%;
      /*      height: 240px;*/
      font-size: 0;
      .background {
        width: 100%;
        height: 100%;
        background-color: white;
        .left-part {
          width: 50%;
          display: inline-block;
          img {
            width: 100%;
          }
        }
        .right-part {
          width: 50%;
          display: inline-block;
          vertical-align: top;
          .already-read {
            text-align: right;
            position: relative;
            img {
              width: 25%;
            }
            .read-amount {
              position: absolute;
              top: 50%;
              right: 15%;
              font-size: 13px;
              color: $font-gray;
            }
          }
          .story-name {
            font-size: 18px;
            font-weight: 700;
            text-align: center;
          }
          .quantity {
            margin-left: 20%;
            margin-top: 10%;
            border-bottom: 1px solid $line-gray;
            img {
              display: inline-block;
              width: 10%;
            }
            .amount {
              display: inline-block;
              font-size: 12px;
              color: $font-gray;
              margin-left: 20%;
            }
          }
          .continue-read {
            margin-top:12px;
            margin-left: 25%;
            margin-right: 25%;
            height :20px;
            line-height: 20px;
            background-color: #00db75 ;
            font-size: 12px;
            border-radius: 5px;
            color: white;
            text-align: center;
          }
        }
      }
      .process-bar {
        height: 3px;
        background-color: #00db75;
      }
    }
    .shelf {
      margin-top: 20px;
      border-bottom: 1px solid $line-gray;
      min-height: 140px;
      &:last-child{
        margin-bottom: 85px;
        border: none;
      }
      .book {
        width: 33.3%;
        float: left;
        text-align: center;
        font-size: 0;
        .cover {
          width:60%;
          height: auto;
          margin-left: 20%;
          margin-right: 20%;
          img{
            width: 100%;
          }
        }
        .progress-bar {
          margin-left: 20%;
          margin-right: 20%;
          height: 2px;
          background-color: #00db75;
        }
        .name {
          margin-top: 2px;
          font-size: 12px;
          color: $font-dark;
        }
      }
    }
  }

</style>
<script>
  import Axios from 'axios'
  import {Toast} from 'mint-ui'
  import notice from '../../components/notice/notice.vue'
  import blank from '../../components/blank/blank.vue'
  export default {
    components: {
      blank,
      notice
    },
    data () {
      return {
        title: '',
        subList: [],
        contentList: [],
        cover: {
          id: '',
          name: '',
          follower: 0,
          nodeNum: 0,  // 后续结点数量
          myCreation: 0, // 当前用户参与编辑的数量
          coverImg: '',
          readCounts: '', // 已读节点
          readPercent: '',
          latest: ''
        }
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      changeCover (obj) {
        this.cover.id = obj.id
        this.cover.name = obj.name
        this.cover.follower = obj.follower
        this.cover.coverImg = obj.coverImg
        this.cover.readPercent = obj.readPercent
        if (obj.id && this.cover.id) {
          Axios.all([Axios.get('/user/getSubStack', {params: {id: obj.id}}), Axios.get('/user/getContribute', {params: {id: this.cover.id}})])
            .then(Axios.spread((stack, contr) => {
              this.cover.readCounts = stack.data.readCounts
              this.cover.latest = stack.data.latest
              this.cover.nodeNum = stack.data.count
              this.cover.myCreation = contr.data.count
              this.cover.readPercent = `${(100 * this.cover.readCounts / this.cover.nodeNum).toFixed(0)}%`
            }))
        }
      },
      getData () {
        Axios.get('/user/getMySubscription', {
          params: {
            user: this.$route.params.user
          }
        }).then(response => {
          if (!response.data.error) {
            if (response.data.result) {
              this.subList = response.data.result
              if (this.subList.length) {
                this.cover.id = this.subList[0].id
                this.cover.name = this.subList[0].name
                this.cover.follower = this.subList[0].follower
                this.cover.coverImg = this.subList[0].coverImg
                let temp = parseInt(this.subList.length / 3)
                for (let i = 0; i <= temp; i++) {
                  this.contentList[i] = []
                }
                for (let i = 0; i <= temp; i++) {
                  for (let j = 0; j < 3; j++) {
                    if (this.subList[i * 3 + j]) {
                      this.contentList[i][j] = this.subList[i * 3 + j]
                    } else {
                      break
                    }
                  }
                }
                for (let i = 0; i < this.subList.length; i++) {
                  Axios.all([Axios.get('/user/getSubStack', {params: {id: this.subList[i].id}}), Axios.get('/user/getContribute', {params: {id: this.subList[i].id}})])
                    .then(Axios.spread((stack, contr) => {
                      this.subList[i].readCounts = stack.data.readCounts
                      this.subList[i].latest = stack.data.latest
                      this.subList[i].nodeNum = stack.data.count
                      this.subList[i].myCreation = contr.data.count
                      this.subList[i].readPercent = `${(100 * this.subList[i].readCounts / this.subList[i].nodeNum).toFixed(0)}`
                      this.$set(this.subList, i, this.subList[i])  // 向vue声明
                    }))
                }
              }
              this.changeCover(this.cover)
            }
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
        Axios.get('/register/checkUser', {
          params: {
            user: this.$route.params.user
          }
        }).then(response => {
          if (response.data.customer) {
            this.title = response.data.sex + '的订阅'
          } else {
            this.title = '我的订阅'
          }
        })
      },
      setCoverErrorImg () {
        this.cover.coverImg = require('../../img/photo/default2.png')
      },
      setErrorImg (i, j) {
        this.contentList[i][j].coverImg = require('../../img/photo/default2.png')
      },
      goStory (id) {
        this.$router.push(`/story/${id}`)
      }
    }
  }
</script>
