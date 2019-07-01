<template>
  <div class="changeSign" v-if="signView">
    <div class="notice">
    <span class="cancel" @click="closeSignView">
      取消
    </span>
    <span class="title">
        设置个性签名
    </span>
    <span class="finish" v-if="signCheck" @click="changeSign">
      完成
    </span>
    <span class="finish fake" v-else>
      完成
    </span>
    </div>
    <div class="input">
      <textarea name="sign" v-model="sign"></textarea>
      <div class="count">{{count}}</div>
    </div>
  </div>
</template>
<script>
  import Axios from 'axios'
  import {Toast} from 'mint-ui'
  export default {
    props: ['id'],
    data () {
      return {
        sign: '',
        signView: false
      }
    },
    created: function () {
      this.getData()
    },
    computed: {
      count: function () {
        if (!this.sign) {
          return 30
        } else if ((30 - this.sign.length) >= 0) {
          return 30 - this.sign.length
        } else {
          return '您已超出最大字数'
        }
      },
      signCheck: function () {
        return !isNaN(this.count) && this.count >= 0 && this.count <= 30
      }
    },
    methods: {
      changeSign: function () {
        Axios.post('/user/changeSign', {
          id: this.id,
          sign: this.sign
        }).then(response => {
          if (!response.data.error) {
            this.$emit('refresh')
            this.closeSignView()
            Toast({
              message: '修改成功',
              position: 'middle',
              duration: 800
            })
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 800
            })
          }
        }).catch(error => {
          if (error) {
            Toast({
              message: '发生错误，请稍后再试',
              position: 'middle',
              duration: 800
            })
          }
        })
      },
      openSignView () {
        this.signView = true
      },
      closeSignView () {
        this.signView = false
      },
      getData () {
        Axios.get('/user/getSign', {
          params: {
            id: this.id
          }
        }).then(response => {
          if (!response.data.error) {
            this.sign = response.data.sign
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 800
            })
          }
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .changeSign {
    position: absolute;
    left: 0;
    top: -42px;
    width: 100%;
    height: 100%;
    background: $bg-gray;
    .notice {
      position: absolute;
      width: 100%;
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      span {
        text-align: center;
        font-size: 16px;
      }
      .cancel {
        margin-left: 5px;
        flex: 1;
      }
      .title {
        flex: 7;
      }
      .finish {
        margin-right: 5px;
        flex: 1;
      }
      .finish.fake {
        color: $font-color;
      }
    }
    .input {
      width: 100%;
      margin-top: 62px;
      textarea {
        font-size: 14px;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        border: none;
        outline: none;
        padding: 5px;
      }
      .count {
        position: absolute;
        right:  5px;
        top: 105px;
        color: #7f7f7f;
      }
    }
  }
</style>
