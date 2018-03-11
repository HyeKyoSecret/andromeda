<template>
  <div class="friendList">
    <notice title="我的好友"></notice>
    <div class="search">
      <span class="magnifier"><img src="../../img/icon/magnifier.png" /></span>
      <span class="searchbar"><input type="text" placeholder="搜索" @focus="startSearch" @input="searchFriend" v-model="search"></span>
      <span class="delete" v-if="deleteBtn" @click="deleteSearch"><img src="../../img/icon/delete.png"></span>
      <span class="cancel" v-if="cancelBtn" @click="cancelSearch">取消</span>
    </div>
    <div class="search-board" v-if="searchBoard">
      <div class="friend-list">
        <div class="one-friend" v-for="item in searchList">
          <div class="head"><img src="../../img/photo/2b_head.png" /></div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </div>
    <!--<div class="star-friend">-->
    <!--<span><img src="../../img/icon/gray_star.png" /></span>-->
    <!--<span>星标好友</span>-->
    <!--</div>-->
    <!--<div class="friend-list">-->
    <!--<div class="one-friend">-->
    <!--<div class="icon"><img src="../../img/icon/greenbingo.png" /></div>-->
    <!--<div class="head"><img src="../../img/photo/2b_head.png" /></div>-->
    <!--<div class="name">2B</div>-->
    <!--</div>-->
    <!--<div class="one-friend">-->
    <!--<div class="icon"><img src="../../img/icon/greenbingo.png" /></div>-->
    <!--<div class="head"><img src="../../img/photo/2b_head.png" /></div>-->
    <!--<div class="name">2B</div>-->
    <!--</div>-->
    <!--</div>-->
    <div class="friend-list" v-show="flVis">
      <div class="one-friend" v-for='item in friendList'>
        <div class="head"><img src="../../img/photo/2b_head.png" /></div>
        <div class="name">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import "../../scss/config";
  .friendList{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: $bg-gray;
    .search {
      background-color: white;
      height: 42px;
      display: flex;
      align-items: center;
      width: 100%;
      .magnifier {
        margin-left: 10px;
        margin-right: 12px;
        img {
          height: 22px;
          width: 20px;
        }
      }
      .searchbar {
        width: 68%;
      }
      .delete {
        img {
          height: 17px;
          width: 17px;
        }
      }
      .cancel {
        margin-left: 15px;
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
    .search-board {
      width: 100%;
      min-height: calc(100vh - 84px);
      background: $bg-gray;
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
      &:last-child {
        margin-bottom: 100px;
      }
      .one-friend {
        background: white;
        display: flex;
        border-bottom: 1px solid $line-gray;
        height: 60px;
        width: 100%;
        align-items: center;
        .head {
          margin-right: 25px;
          img {
            margin-left: 25px;
            height: 35px;
            width: 35px;
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
  import notice from '../../components/notice/notice.vue'
  import { Toast } from 'mint-ui'
  export default {
    components: {
      notice
    },
    data () {
      return {
        search: '',
        deleteBtn: false,  // 删除按钮
        searchBoard: false,  // 搜索版
        cancelBtn: false,
        friendList: [],
        searchList: [],
        flVis: true
      }
    },
    created: function () {
      this.getData()
    },
    watch: {
      search: function (val) {
        val.length > 0 ? this.deleteBtn = true : this.deleteBtn = false
      }
    },
    methods: {
      getData () {
        Axios.get('/user/getFriendList', {
          params: {
            user: this.$route.params.user
          }
        }).then(response => {
          this.friendList = response.data.result
        })
      },
      startSearch () {
        this.searchList = ''
        this.searchBoard = true
        this.cancelBtn = true
        this.flVis = false
      },
      searchFriend: debounce(function () {
        Axios.post('/user/searchFriend', {
          user: this.$route.params.user,
          content: this.search
        }).then(response => {
          if (!response.data.error) {
            this.searchList = response.data.result
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      }, 1000),
      cancelSearch () {
        this.searchBoard = false
        this.deleteBtn = false
        this.cancelBtn = false
        this.search = ''
        this.flVis = true
      },
      deleteSearch () {
        this.search = ''
      }
    }
  }
</script>
