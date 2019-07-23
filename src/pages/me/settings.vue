<template>
    <div class="settings">
      <notice title="我的设置"></notice>
      <div class="content">
        <div class="line">
          <div class="left">
            正文字体大小
          </div>
          <div class="right" @click="openFontChange">
            <div class="words">
              {{settings.fontSize}}
            </div>
            <div class="icon">
              <img src="../../img/icon/right.png">
            </div>
          </div>
        </div>
      </div>
      <mt-radio ref="radio" v-on:refresh="getSettings" v-bind:id="userId"></mt-radio>
    </div>
</template>
<script>
  import notice from '../../components/notice/notice.vue'
  import MtRadio from '../../components/me/settings/changeFontSize.vue'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        settings: {},
        userId: this.$route.params.user,
        size: ''
      }
    },
    created: function () {
      this.getSettings()
    },
    methods: {
      openFontChange () {
        this.$refs.radio.openRadio()
      },
      getSettings () {
        Axios.get('/user/getSettings')
          .then(response => {
            if (!response.data.error) {
              this.settings = response.data.settings
            } else {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 800
              })
            }
          })
      }
    },
    components: {
      notice,
      MtRadio
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .settings {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    margin-top: 42px;
    min-height: calc(100vh - 42px);
    background: $bg-gray;
    .content {
      margin-top: 15px;
      .line {
        display: flex;
        align-items: center;
        height: 42px;
        width: 100%;
        background: white;
        .left{
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 25px;
        }
        .right {
          flex: 3;
          display: flex;
          height: 100%;
          align-items: center;
          font-size: 15px;
          border-bottom: 1px solid $border-gray;
          .words {
            flex: 7;
            height: 100%;
            margin-left: 15px;
            line-height: 42px;
            text-align: right;
            padding-right: 20px;
            font-size: 14px;
          }
          .icon {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            img {
              margin-right: 11px;
              width: 12px;
              height: 20px;
            }
          }
        }
        &:last-child{
          .right {
            border: none;
          }
        }
      }
    }
  }
</style>
