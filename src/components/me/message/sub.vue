<template>
  <div class="subscribe">
    <notice title="订阅消息"></notice>
    <div class="subscribe-new" v-for="item in result" @click="goStory(item.id)" v-if="result.length">
      <div class="left">
        <img src="../../../img/images/yuner.jpg" alt="">
      </div>
      <div class="middle">
        <div class="name">{{item.name}}</div>
        <div class="content">{{item.words}}</div>
      </div>
      <div class="right">
        <div class="date">{{item.date}}</div>
        <div class="new-number"><span v-if="item.notReaded > 0">{{item.notReaded}}</span></div>
      </div>
    </div>
    <blank v-if="!result.length"></blank>
  </div>
</template>
<script>
  import notice from '../../notice/notice'
  import blank from '../../blank/blank'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        result: []
      }
    },
    created: function () {
      this.getData()
    },
    components: {
      notice,
      blank
    },
    methods: {
      getData () {
        Axios.get('/user/getSubscribeMessage')
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              this.result = response.data.result
            }
          })
      },
      goStory (id) {
        this.$router.push(`subMessage/${id}`)
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .subscribe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: $bg-gray;
    min-height: calc(100vh - 58px);
    z-index: 997;
    .subscribe-new {
      margin-top: 50px;
      width: 100%;
      height: 90px;
      display: flex;
      background: white;
      align-items: center;
      .left {
        flex: 1;
        margin-left: 8px;
        img {
          border-radius: 2px;
          width: 51px;
          height: 68px;
        }
      }
      .middle {
        height: 70px;
        margin-left: 10px;
        flex: 6;
        .name {
          color: $font-dark;
        }
        .content {
          margin-top: 5px;
          color: $font-color;
          display: -webkit-box;
          display: -moz-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          -moz-box-orient: vertical;
          -moz-line-clamp: 2;
          overflow: hidden;
        }
      }
      .right {
        height: 70px;
        flex: 1.8;
        margin-left: 5px;
        .date {
          height: 25px;
          color: $font-gray;
          text-align: right;
          margin-right: 15px;
          font-size: 12px;
        }
        .new-number {
          height: 45px;
          text-align: right;
          margin-top: 15px;
          margin-right: 15px;
          span {
            color: white;
            display: inline-block;
            background: $main-red;
            width: 16px;
            height: 16px;
            border-radius: 2000px;
            text-align: center;
            line-height: 16px;
          }
        }
      }
    }
  }
</style>
