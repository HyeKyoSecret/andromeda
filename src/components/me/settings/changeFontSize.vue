<template>
  <div class="change-font-size" v-show="radio" @click.self="closeRadio">
    <div class="change-content">
      <mt-radio
        align="right"
        v-model="value"
        :options="['正常', '大', '特大']">
      </mt-radio>
    </div>
  </div>
</template>
<script>
  import Axios from 'axios'
  import {Toast} from 'mint-ui'
  export default {
    data () {
      return {
        value: '',
        radio: false
      }
    },
    created: function () {
      this.getFontSize()
      this.changeFontStyle()
    },
    watch: {
      value: function (newVal, oldVal) {
        setTimeout(function () {
          this.radio = false
          if (oldVal !== '') {
            Axios.post('/user/changeFontSize', {
              value: this.value
            }).then(response => {
              if (!response.data.error) {
                this.$emit('refresh')
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
          }
        }.bind(this), 400)
      }
    },
    methods: {
      getFontSize () {
        Axios.get('/user/getFontSize')
          .then(response => {
            if (!response.data.error) {
              this.value = response.data.size
            } else {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 800
              })
            }
          })
      },
      openRadio () {
        this.radio = true
      },
      closeRadio () {
        this.radio = false
      },
      changeFontStyle () {

      }
    },
    props: ['id']
  }
</script>
<style lang='scss'>
  @import "../../../scss/style.css";
  @import "../../../scss/config";
  .change-font-size {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
  }
  .change-content {
    position: absolute;
    bottom: 80px;
    left: 0;
    width: 100%;
  }
  .mint-cell-wrapper {
    background-image: none !important;
    border-bottom: 1px solid #d9d9d9;
  }
</style>
