<template>
  <div class="dbTest">
    <div class="notice">
      <span class="icon">
        <img src="../img/icon/back.png">
      </span>
      <span class="title">
        我的消息
      </span>
    </div>
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
    <!--<div class="qq">-->
      <!--<div class="one">1</div>-->
      <!--<div class="two">2</div>-->
    <!--</div>-->
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
  @import "../scss/config";
  .dbTest {
    /*margin-left: 40px;*/
    /*margin-top: 30px;*/
    font-size: 14px;
    .notice {
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      span{
        text-align: center;
        font-size: 16px;
      }
      img {
        position: absolute;
        top: 10px;
        left: 11px;
        width: 12px;
        height: 20px;
      }
    }
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
/*  .qq {
    width: 100%;
    height: 100px;
    background: yellow;
    !*display: flex;*!
    !*justify-content: center;*!
    div {
      height: 70px;
      background: green;
      !*display: inline-block;*!
    }
    .one {
      width: 50px;
      position: relative;
      left: 50%;
      margin-left: -25px;
    }
    .two {
      width: 70px;
      background: gray;
      position: absolute;
      right: 50px;
      margin-top: -70px;
    }
  }*/
</style>
