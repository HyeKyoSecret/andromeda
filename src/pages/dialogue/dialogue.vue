<template>
  <div class="dialogue" v-infinite-scroll="getData"
       infinite-scroll-disabled=false
       infinite-scroll-distance="10"
       infinite-scroll-immediate-check=true>
    <notice :title="title"></notice>
    <div class="content">
      <div v-for="(item, index) in result">
        <div class="time-line" v-if="index === 0 || (result[index]['timestamp'] - result[index - 1]['timestamp']) > 180000">{{item.date}}</div>
        <div class="message from" v-if="!item.me">
          <span class="headImg"><img :src="item.headImg" alt="" @error="setDefaultImg(index)" @click="goPeople(item.id)"></span>
          <span class="message-content">{{item.content}}</span>
        </div>
        <div class="message to" v-else>
          <span class="message-content">{{item.content}}</span>
          <span class="headImg"><img :src="item.headImg" alt="" @error="setDefaultImg(index)" @click="goPeople(item.id)"></span>
        </div>
      </div>
    </div>
    <div class="blank">向上滑动刷新数据</div>
    <div class="message-input">
      <textarea id="textArea" v-model.trim="message" rows="1"  @focus="showButton" @blur="scrollBottom"></textarea>
      <span class="fake submit" v-if="fakeSubmit && !messageCheck">发送</span>
      <span class="submit" v-if="messageCheck" @click="sendMessage(id)">发送</span>
    </div>
  </div>
</template>
<script>
  import Axios from 'axios'
  import notice from '../../components/notice/notice.vue'
  import autoSize from 'autosize'
  import { Toast } from 'mint-ui'
  export default {
    name: 'dialogue',
    data () {
      return {
        title: '留言',
        result: [],
        message: '',
        fakeSubmit: false,
        id: this.$route.params.id
      }
    },
    mounted: function () {
      autoSize(document.querySelectorAll('textarea'))
    },
    created: function () {
      this.getData()
      setTimeout(() => {
        window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight)
      }, 100)
    },
    computed: {
      messageCheck: function () {
        if (this.message.length > 0 && this.message.length <= 250) {
          this.fakeSubmit = false
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      getData () {
        Axios.get('/dialogue/getDialogue', {
          params: {
            id: this.$route.params.id
          }
        })
          .then(response => {
            if (!response.data.error) {
              this.result = response.data.result
              this.title = response.data.title
            } else {
              Toast({
                position: 'middle',
                message: response.data.message,
                duration: 1000
              })
            }
          })
      },
      sendMessage (id) {
        Axios.post('/dialogue/sendMessage', {
          id: id,
          message: this.message
        }).then(response => {
          if (response.data.error) {
            Toast({
              position: 'middle',
              message: response.data.message,
              duration: 1000
            })
          } else {
            this.getData()
            this.message = ''
            window.scrollTo(0, document.documentElement.clientHeight)
          }
        })
      },
      setDefaultImg (index) {
        this.result[index].headImg = require('../../img/images/defaultHeadImg.png')
      },
      showButton () {
        this.fakeSubmit = true
      },
      goPeople (id) {
        this.$router.push('/people/' + id)
      },
      scrollBottom () {
        window.scrollTo(0, document.documentElement.clientHeight)
      }
    },
    components: {
      notice
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .dialogue {
    min-height: calc(100vh - 42px);
    .blank {
      margin-top: 15px;
      text-align: center;
      color: $font-gray;
      width: 100%;
      height: 100px;
    }
    .content {
      margin-top: 54px;
      .time-line {
        width: 100%;
        text-align: center;
        color: $font-gray;
      }
      .message.from{
        width: 100%;
        margin-top: 15px;
        span.headImg {
          margin-left: 12px;
          display: inline-block;
          img {
            width: 45px;
          }
        }
        span.message-content {
          font-size: 14px;
          display: inline-block;
          color: $font-dark;
          max-width: 52%;
          vertical-align: top;
          background: $main-color;
          border-radius: 5px;
          margin-left: 5px;
          padding: 8px 10px 8px 10px;
        }
      }
      .message.to{
        margin-top: 15px;
        width: 100%;
        text-align: right;
        span.headImg {
          margin-right: 12px;
          display: inline-block;
          img {
            width: 45px;
          }
        }
        span.message-content {
          font-size: 14px;
          display: inline-block;
          color: $font-dark;
          max-width: 52%;
          vertical-align: top;
          background: white;
          border-radius: 5px;
          margin-right: 5px;
          padding: 8px;
          text-align: left;
        }
      }
    }
    .message-input {
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
      .message-input {
        max-width: 700px;
      }
    }
  }
</style>
