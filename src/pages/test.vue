<template>
  <div class="test">
    <div class="abc" @click="cutWords">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
    </div>
    <router-view></router-view>
  </div>
</template>
<style lang="scss" scoped>
  .test {
    .abc {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      background: white;
      div {
        flex: 1;
        color: blue;
      }
    }
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  }
</style>
<script>
export default {
  data () {
    return {
      words: 'hello.pick.andromeda.txt'
    }
  },
  methods: {
    cutWords: function () {
      let temp = this.words.split('.')
      console.log(temp[temp.length - 1])
    }
  }
}
</script>
