<template>
  <div class="notice">
    <span class="icon" @click="goBack">
      <img src="../../img/icon/back.png">
    </span>
    <span class="title">
      {{title}}
    </span>
      <span class="mark" v-if="more && mark" @click="changeMark">
        <img src="../../img/icon/mark_active.png" alt="">
      </span>
        <span class="mark" v-if="more && !mark" @click="changeMark">
        <img src="../../img/icon/mark.png" alt="">
      </span>
      <span class="more" v-if="more" @click="showMenu">
        <img src="../../img/icon/more.png" alt="">
      </span>
        <!--<span class="search" v-if="more" @click="openSearch">-->
        <!--<img src="../../img/icon/search.png" alt="">-->
      <!--</span>-->
        <!--<span class="font" v-if="more" @click="openFontSettings">-->
        <!--<img src="../../img/icon/font.png" alt="">-->
     <!--</span>-->
    <span class="message" v-if="message" @click="sendMessage(message)">
        <img src="../../img/icon/message.png" alt="">
     </span>
    <div v-if="more && menuActive" class="menu">
      <div class="content" v-for="item in menuList" :key="item.name" @click="listenAll(item.methods)">
        <span class="menu-icon"><img :src="item.icon" alt="">
        </span><span class="menu-word" :class="item.name">{{item.label}}</span>
      </div>
    </div>
    <div class="triangle" @click="showMenu" v-if="menuActive"></div>
  </div>
</template>
<script>
  // import moment from 'moment'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    props: ['title', 'more', 'id', 'mark', 'message', 'search', 'searchBoard'],
    data () {
      return {
        menu: [
          {
            name: 'search',
            label: '搜索',
            icon: require('../../img/icon/graysearch.png'),
            methods: 'openSearch'
          },
          {
            name: 'font',
            label: '字体',
            icon: require('../../img/icon/font.png'),
            methods: 'openFontSettings'
          },
          {
            name: 'report',
            label: '举报',
            icon: require('../../img/icon/report.png'),
            methods: 'report'
          }
        ],
        menuList: [],
        menuActive: false,
        rangeValue: ''
      }
    },
    created: function () {
      this.buildMenuList()
    },
    methods: {
      listenAll (methods) {
        this[methods]()
      },
      goBack () {
        this.$emit('close')
        this.$router.go(-1)
      },
      showMenu () {
        if (this.searchBoard) {
          this.$emit('closeSearchBoard')
        } else {
          this.menuActive = !this.menuActive
        }
      },
      sendMessage (id) {
        this.$router.push('/dialogue/' + id)
      },
      openMore () {
        this.moreList = true
      },
      buildMenuList () {
        if (this.more) {
          for (let i = 0; i < this.menu.length; i++) {
            for (let j = 0; j < this.more.length; j++) {
              if (this.more[j] === this.menu[i].name) {
                this.menuList.push({
                  label: this.menu[i].label,
                  icon: this.menu[i].icon,
                  name: this.menu[i].name,
                  methods: this.menu[i].methods
                })
                break
              }
            }
          }
        }
      },
      changeMark () {
        Axios.post('/user/changeMark', {
          id: this.id,
          markActive: !this.mark
        }).then(response => {
          this.$emit('getMark')
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      openFontSettings () {
        this.menuActive = false
        this.$emit('openFontSettings')
      },
      openSearch () {
        this.menuActive = false
        this.$emit('openSearch')
      },
      report () {
        Axios.post('/story/reportStory', {
          id: this.$route.params.id
        }).then(response => {
          this.menuActive = false
          Toast({
            message: response.data.message,
            position: 'middle',
            duration: 1000
          })
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  .notice {
    z-index: 800;
    background: $main-color;
    height: 42px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    width: 100%;
    .triangle {
      position: absolute;
      top: 12px;
      right: 10px;
      width:0px;
      height:0px;
      border-top: 15px solid rgba(0,0,0,0);
      border-right: 15px solid  rgba(0,0,0,0);
      border-bottom: 15px solid rgba(255, 255, 255, 0.95);
      border-left: 15px solid  rgba(0,0,0,0);
    }
    .range {
      position: absolute;
      top: 42px;
      left: 0;
      background: white;
      width: 100%;
      height: 50px;
    }
    span {
      text-align: center;
      font-size: 16px;
    }
    .icon {
      position: absolute;
      z-index: 999;
      left: 4px;
      display: inline-block;
      height: 42px;
      width: 30px;
      line-height: 50px;
      img {
        width: 12px;
        height: 20px;
      }
    }
    .message {
      position: absolute;
      right: 6px;
      display: inline-block;
      height: 42px;
      width: 30px;
      line-height: 50px;
      img {
        width: 22px;
        height: 21px;
      }
    }
    .mark {
      position: absolute;
      right: 40px;
      display: inline-block;
      height: 42px;
      width: 30px;
      line-height: 50px;
      img {
        width: 22px;
        height: 21px;
      }
    }
    .more {
      position: absolute;
      right: 3px;
      display: inline-block;
      height: 42px;
      width: 42px;
      line-height: 39px;
      img {
        width: 22px;
        height: 7px;
      }
    }
    .menu {
      position: absolute;
      right: 0;
      top: 42px;
      background: rgba(255, 255, 255, 0.95);
      width: 110px;
      z-index: 999;
      border-radius: 6px;
      .content {
        height: 38px;
        vertical-align: middle;
        border-bottom: 1px solid $border-gray;
        &:last-child {
          border: none;
        }
        .menu-icon {
          width: 100%;
          img {
            height: 18px;
            vertical-align: middle;
            margin-right: 8px;
            text-align: left;
            margin-left: 10px;
          }
        }
        .menu-word {
          width: 100%;
          margin-top: -20px;
          color: $w-gray;
          font-size: 14px;
          line-height: 40px;
          margin-left: 10px;
        }
        .menu-word.search {
          margin-left: 13px;
        }
      }

    }
  }
  @media (min-width: 700px) {
    .notice {
      max-width: 700px;
    }
  }
</style>
