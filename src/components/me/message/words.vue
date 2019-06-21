<template>
  <div class="subscribe">
    <notice title="留言"></notice>
    <div class="sub-content">
      <div class="subscribe-new" v-for="item in result" @click="go(item.peopleId)" v-if="result.length">
        <div class="left">
          <img :src="item.headImg" alt="">
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
    </div>
    <blank v-if="!result.length"></blank>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .subscribe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: $bg-gray;
    min-height: calc(100vh - 58px);
    /*z-index: 997;*/
    .sub-content {
      margin-top: 92px;
    }
    .subscribe-new {
      margin-top: 10px;
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
          width: 60px;
          height: 60px;
          border-radius: 2px;
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
    name: 'words',
    created: function () {
      this.getData()
    },
    components: {
      notice,
      blank
    },
    methods: {
      swipe (e) {
        if (e.direction === 'Left') {
          this.$router.push({name: 'message_request', params: {user: this.$route.params.user}})
        }
      },
      getData () {
        Axios.get('/user/getMessageWords')
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              this.result = response.data.result
              console.log(this.result)
            }
          })
      },
      go (id) {
        this.$router.push(`/dialogue/${id}`)
      }
    }
  }
</script>
