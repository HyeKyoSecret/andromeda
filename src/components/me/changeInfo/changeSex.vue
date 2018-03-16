<template>
  <div class="radio" v-show="radio" @click.self="closeRadio">
    <div class="content">
      <mt-radio
        align="right"
        v-model="value"
        :options="['男', '女']">
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
      this.getSex()
    },
    watch: {
      value: function (newVal, oldVal) {
        setTimeout(function () {
          this.radio = false
          if (oldVal !== '') {
            Axios.post('/user/changeSex', {
              id: this.id,
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
      getSex () {
        Axios.get('/user/getChangeInfo', {
          params: {
            id: this.id
          }
        }).then(response => {
          if (!response.data.error) {
            this.value = response.data.sex
          }
        })
      },
      openRadio () {
        this.radio = true
      },
      closeRadio () {
        this.radio = false
      }
    },
    props: ['id']
  }
</script>
<style lang='scss' scoped>
  @import "../../../scss/style.css";
  .radio {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
  }
  .content {
    position: absolute;
    bottom: 80px;
    left: 0;
    width: 100%;
  }
</style>
