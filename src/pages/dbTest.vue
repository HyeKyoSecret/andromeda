<template>
  <div class="dbTest">
    <div>已存在的根故事:
      <span v-for="item in rootStoryName">
       {{item}}
      </span>
    </div>
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
        <option value="item" v-for="item in rootStoryName">{{item}}</option>
      </select>
    </div>
    <div class="buildStory">
      <div>手动创建新故事</div>
      <label>前趋结点： <input type="text" v-model="ftNode"></label>
      <label>结点名称：<input type="text" v-model="nodeName"></label>
      <button @click="buildStory">创建故事</button>
    </div>
  </div>
</template>
<script>
  import Axios from 'axios'
  export default {
    data () {
      return {
        rootStory: [], // 已存在的根节点
        rootName: null, // 根节点故事名
        ftNode: null, // 前趋结点
        nodeName: null // 结点名称
      }
    },
    computed: {
      rootStoryName: function () {
        return this.rootStory.map((root) => {
          return root.name
        })
      }
    },
    created: function () {
      this.getRootStory()
    },
    methods: {
      getRootStory () {
        Axios.get('/story/getRootStory')
          .then((response) => {
            this.rootStory = response.data.concat()
          })
      },
      buildRoot () {
        Axios.post('/story/buildRoot', {
          rootName: this.rootName
        }).then((response) => {
          console.log(response.data)
        })
        this.getRootStory()
      },
      buildStory () {
        Axios.post('/story/buildStory', {
          ftNode: this.ftNode,
          nodeName: this.nodeName
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
      border: 2px solid green;
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
