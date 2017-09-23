<template>
  <div class="dbTest">
    <div>已存在的根故事:</div>
    <div class="rootStory">
      <div class="title">创建故事</div>
      <label>
        根故事名：<input type="text" v-model="rootName">
      </label>
      <button class="buildStory" @click="buildRoot">创建</button>
    </div>
    <div class="chooseStory">
      选择要展示的故事
      <select name="story" id="">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
  </div>
</template>
<script>
  import Axios from 'axios'
  export default {
    data () {
      return {
        rootName: null
      }
    },
    methods: {
      buildRoot () {
        Axios.post('/story/buildRoot', {
          rootName: this.rootName
        }).then((response) => {
          console.log(response.data)
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  .dbTest {
    margin-left: 40px;
    margin-top: 30px;
    font-size: 14px;
    .rootStory {
      margin-top: 15px;
      border: 1px solid green;
      padding: 20px;
      .title {
        font-size: 18px;
      }
    }
    .chooseStory {
      margin-top: 15px;
    }
  }
</style>
