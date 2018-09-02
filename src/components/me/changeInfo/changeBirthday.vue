<template>
  <div>
    <mt-datetime-picker
      ref="picker"
      type="date"
      :startDate = startDate
      :endDate = endDate
      @confirm = 'changeBirthday'
      v-model="pickerValue">
    </mt-datetime-picker>
  </div>
</template>
<script>
  import Axios from 'axios'
  import {Toast} from 'mint-ui'
  export default {
    props: ['id'],
    data () {
      return {
        startDate: new Date('1960', '1', '1'),
        endDate: new Date('2008', '12', '31'),
        pickerValue: ''
      }
    },
    methods: {
      openPicker () {
        this.$refs.picker.open()
      },
      changeBirthday () {
        Axios.post('/user/changeBirthday', {
          date: this.pickerValue
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
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../../scss/style.css";
</style>
