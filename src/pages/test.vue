<template>
  <div>
    <div class="abc">
      <button @click="openPicker">打开</button>
      <mt-datetime-picker
        ref="picker"
        type="date"
        :startDate = startDate
        :endDate = endDate
        v-model="pickerValue">
      </mt-datetime-picker>
    </div>
    <footMenu class="hehe">
    </footMenu>
  </div>
</template>
<script>
//  import Axios from 'axios'
  import FootMenu from '../components/foot-menu.vue'
  export default {
    data () {
      return {
        startDate: new Date('1960', '1', '1'),
        endDate: new Date('2008', '12', '31'),
        pickerValue: ''
      }
    },
    components: {
      FootMenu
    },
    methods: {
      openPicker () {
        this.$refs.picker.open()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../scss/style.css";
</style>
