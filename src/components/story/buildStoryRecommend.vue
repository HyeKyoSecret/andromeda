<template>
  <div class="build-story-recommend" v-if="storyRecommendVis">
    <div class="notice">
      <span class="cancel" :class="{extend: recommendList.length}" @click="back">
        上一步
      </span>
      <span class="title">
          选择好友推荐
      </span>
        <span class="finish" :class="{extend: recommendList.length}" @click="buildStory" v-if="buildPermit">
        发布
        <label v-if="recommendList.length">({{recommendList.length}}/10)</label>
      </span>
      <span class="fake finish" :class="{extend: recommendList.length}" v-else>
        发布
        <label v-if="recommendList.length">({{recommendList.length}}/10)</label>
      </span>
    </div>
    <div class="search">
      <span class="magnifier"><img src="../../img/icon/magnifier.png" /></span>
      <span class="searchbar"><input type="text" placeholder="搜索" @focus="startSearch" @input="searchFriend" v-model="search"></span>
      <span class="delete" v-if="deleteBtn" @click="deleteSearch"><img src="../../img/icon/delete.png"></span>
      <span class="cancel" v-if="cancelBtn" @click="cancelSearch">取消</span>
    </div>
    <div class="search-board" v-if="searchBoard">
      <div class="friend-list">
        <div class="one-friend" v-for="(item, index) in searchList" @click="addSearchFriend(index)">
          <div class="icon">
            <img src="../../img/icon/greenbingo_unselected.png" v-if="!item.active"/>
            <img src="../../img/icon/greenbingo.png" v-else/></div>
          <div class="head"><img :src="item.headImg" @error="setErrorImg(index, 'search')"/></div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </div>
    <!--<div class="star-friend">-->
      <!--<span><thumb src="../../thumb/icon/gray_star.png" /></span>-->
      <!--<span>星标好友</span>-->
    <!--</div>-->
    <!--<div class="friend-list">-->
      <!--<div class="one-friend">-->
        <!--<div class="icon"><thumb src="../../thumb/icon/greenbingo.png" /></div>-->
        <!--<div class="head"><thumb src="../../thumb/photo/2b.png" /></div>-->
        <!--<div class="name">2B</div>-->
      <!--</div>-->
      <!--<div class="one-friend">-->
        <!--<div class="icon"><thumb src="../../thumb/icon/greenbingo.png" /></div>-->
        <!--<div class="head"><thumb src="../../thumb/photo/2b.png" /></div>-->
        <!--<div class="name">2B</div>-->
      <!--</div>-->
    <!--</div>-->
    <div class="friend-list" v-show="flVis">
      <div class="one-friend" v-for='(item, index) in friendList' @click="activeFriend(index)">
        <div class="icon">
          <img src="../../img/icon/greenbingo_unselected.png" v-if="!item.active"/>
          <img src="../../img/icon/greenbingo.png" v-else/></div>
        <div class="head"><img :src="item.headImg" @error="setErrorImg(index, 'friend')"/></div>
        <div class="name">{{item.name}}</div>
      </div>
    </div>
    <div class="friend-list" v-show="selectVis">
      <div class='label' v-if="recommendList.length">已选好友</div>
      <div class="one-friend" v-for='(item, index) in recommendList' @click="recommendFriend(index)">
        <div class="icon">
          <img src="../../img/icon/greenbingo.png" />
        </div>
        <div class="head"><img :src="item.headImg" @error="setErrorImg(index, 'recommend')"/></div>
        <div class="name">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import "../../scss/config";
  .build-story-recommend {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: $bg-gray;
    .notice {
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        text-align: center;
        font-size: 14px;
      }
      .cancel {
        margin-left: 5px;
        flex: 1.6;
      }
      .title {
        flex: 6.8;
      }
      .finish {
        margin-right: 5px;
        flex: 1.6;
      }
      .finish.extend, .cancel.extend {
        flex: 2.5;
      }
      .finish.fake {
        color: $font-color;
      }
    }
    .search {
      background-color: white;
      height: 42px;
      display: flex;
      align-items: center;
      .magnifier {
        display: inline-block;
        width: 30px;
        margin: 0 10px 0 10px;
        img {
          height: 25px;
          width: 23px;
        }
      }
      .searchbar {
        width: calc(100vw - 50px);
        input {
          @media (max-width: 500px) {
            width: 72%;
          }
          @media (min-width: 501px) {
            width: 80%;
          }
        }
      }
      .delete {
        position: absolute;
        right: 50px;
        img {
          height: 17px;
          width: 17px;
        }
      }
      .cancel {
        position: absolute;
        right: 10px;
        margin-left: 8px;
        letter-spacing: 1px;
        font-size: 13px;
        color: $w-gray;
      }
      input{
        color: #333333;
        border: none;
        outline: none;
        padding-left: 5px;
        height: 35px;
        font-size: 14px;
        overflow: hidden;
        width: 95%;
      }
    }
    .star-friend {
      display: flex;
      align-items: center;
      height: 20px;
      margin-top: 25px;
      img {
        height: 18px;
        width: 18px;
        margin-right: 10px;
        margin-left: 10px;
        font-size: 16px;
      }
      span {
        color: $w-gray;
      }
    }
    .friend-list {
      margin-top: 15px;
      .label {
        color: $w-gray;
        margin-bottom: 3px;
        margin-left: 3px;
      }
      .one-friend {
        background: white;
        display: flex;
        border-bottom: 1px solid $line-gray;
        height: 60px;
        width: 100%;
        align-items: center;
        .icon {
          margin-left: 10px;
          margin-right: 25px;
          img {
            height: 20px;
            width: 20px
          }
        }
        .head {
          margin-right: 25px;
          img {
            height: 37px;
            width: 37px;
          }
        }
        .name {
          color: $font-dark;
          font-size: 16px;
        }
        &:last-child {
          border: none;
        }
      }
    }
  }
  </style>
<script>
  import Axios from 'axios'
  import debounce from '../../js/debounce.js'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        search: '',
        deleteBtn: false,  // 删除按钮
        searchBoard: false,  // 搜索版
        cancelBtn: false,
        recommendList: [],
        friendList: [],
        searchList: [],
        selectVis: false,
        flVis: true,
        storyRecommendVis: false
      }
    },
    props: ['buildPermit'],
    created: function () {
      this.getData()
    },
    watch: {
      search: function (val) {
        val.length > 0 ? this.deleteBtn = true : this.deleteBtn = false
      }
    },
    methods: {
      setErrorImg (index, val) {
        if (val === 'friend') {
          this.friendList[index].headImg = require('../../img/images/defaultHeadImg.png')
        } else if (val === 'search') {
          this.searchList[index].headImg = require('../../img/images/defaultHeadImg.png')
        } else if (val === 'recommend') {
          this.recommendList[index].headImg = require('../../img/images/defaultHeadImg.png')
        }
      },
      openRecommend () {
        this.storyRecommendVis = true
      },
      getData () {
        Axios.get('/user/getFriendList').then(response => {
          if (!response.data.error) {
            this.friendList = response.data.result
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      startSearch () {
        this.searchList = ''
        this.searchBoard = true
        this.cancelBtn = true
        this.flVis = false
        this.selectVis = true
      },
      searchFriend: debounce(function () {
        Axios.post('/user/searchFriend', {
          user: 'U1000001',
          content: this.search
        }).then(response => {
          if (!response.data.error) {
            this.searchList = response.data.result
            if (this.recommendList.length) {
              this.searchList.forEach(item => {
                for (let i = 0; i < this.recommendList.length; i++) {
                  if (item.id === this.recommendList[i].id) {
                    item.active = this.recommendList[i].active
                  }
                }
              })
            }
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      }, 700),
      cancelSearch () {
        this.searchBoard = false
        this.deleteBtn = false
        this.cancelBtn = false
        this.search = ''
        this.flVis = true
        this.selectVis = false
      },
      deleteSearch () {
        this.search = ''
      },
      goFriend (id) {
        this.$router.push(`/people/${id}`)
      },
      activeFriend (index) {
        if (this.recommendList.length <= 10) {
          this.friendList[index].active = !this.friendList[index].active
          if (this.friendList[index].active) {
            this.recommendList.push(this.friendList[index])
          } else {
            for (let i = 0; i < this.recommendList.length; i++) {
              if (this.recommendList[i].id === this.friendList[index].id) {
                this.recommendList.splice(i, 1)
              }
            }
          }
        } else {
          Toast({
            message: '推荐好友不得超过10人',
            position: 'middle',
            duration: 1000
          })
        }
      },
      recommendFriend (index) {
        for (let i = 0; i < this.friendList.length; i++) {
          if (this.recommendList[index].id === this.friendList[i].id) {
            this.friendList[i].active = !this.friendList[i].active
          }
        }
        this.recommendList.splice(index, 1)
      },
      addSearchFriend (index) {
        if (this.recommendList.length <= 10) {
          this.searchList[index].active = !this.searchList[index].active
          if (this.searchList[index].active) {
            this.recommendList.push(this.searchList[index])
          } else {
            for (let i = 0; i < this.recommendList.length; i++) {
              if (this.recommendList[i].id === this.searchList[index].id) {
                this.recommendList.splice(i, 1)
              }
            }
          }
          for (let i = 0; i < this.friendList.length; i++) {    // 通知friendList 改变
            if (this.searchList[index].id === this.friendList[i].id) {
              this.friendList[i].active = this.searchList[index].active
            }
          }
        } else {
          Toast({
            message: '推荐好友不得超过10人',
            position: 'middle',
            duration: 1000
          })
        }
      },
      buildStory () {
        this.$emit('build', this.recommendList)
      },
      back () {
        this.storyRecommendVis = false
      }
    }
  }
</script>
