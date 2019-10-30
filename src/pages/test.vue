<template>
  <div class="qwe" id="qwe" @scroll="scrollEvent" @touchstart="touchStart()" @touchend="touchEnd()" @touchmove="touchMove()">
    <div class="inp" v-for="n in 10">
      {{message}} {{stateX}}  +++++++++++ {{stateY}}
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .qwe {
    width: calc(100vh);
    height: 100vh;
    background: yellow;
    overflow-y: auto;
  }
  .inp {
    width: 100%;
    height: 80px;
    background: green;
    margin-top: 10px;
  }
</style>
<script>
  // import story from '../components/story/story'
  export default {
    data () {
      return {
        sp: {},
        message: '',
        stateX: '',
        stateY: ''
      }
    },
    methods: {
      scrollEvent (e) {
        // this.message = e.srcElement.scrollTop + e.srcElement.offsetHeight - e.srcElement.scrollHeight
      },
      touchStart (e) {
        this.message = 'touchStart'
        console.log(event.changedTouches[0].pageX)
      },
      touchEnd (e) {
        this.message = 'touchEnd'
      },
      touchMove (e) {
        this.message = 'touchMove'
      }
    },
    mounted () {
      document.addEventListener('scroll', () => {
        console.log('啊！')
      })
    }
  }
</script>
