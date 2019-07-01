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
        <span class="search" v-if="more" @click="openSearch">
        <img src="../../img/icon/search.png" alt="">
      </span>
        <span class="font" v-if="more" @click="openFontSettings">
        <img src="../../img/icon/font.png" alt="">
     </span>
    <span class="message" v-if="message" @click="sendMessage(message)">
        <img src="../../img/icon/message.png" alt="">
     </span>
    <div v-if="more && menuActive" class="menu">
      <router-link :to="item.path" tag="div" class="content" v-for="item in menuList" :key="item.name">
        <span class="menu-icon"><img :src="item.icon" alt="">
        </span><span class="menu-word">{{item.label}}</span>
      </router-link>
    </div>
  </div>
</template>
<script>
  // import moment from 'moment'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    props: ['title', 'more', 'id', 'mark', 'message'],
    data () {
      return {
        menu: [
          {
            name: 'report',
            label: '举报',
            icon: require('../../img/icon/report.png'),
            path: '/report'
          },
          {
            name: 'font',
            label: '字体',
            icon: require('../../img/icon/font.png'),
            path: '/setFont'
          },
          {
            name: 'font',
            label: '加入书签',
            icon: require('../../img/icon/mark.png'),
            path: '/addFriend'
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
      goBack () {
        this.$emit('close')
        this.$router.go(-1)
      },
      showMenu () {
        this.menuActive = !this.menuActive
      },
      sendMessage (id) {
        this.$router.push('/dialogue/' + id)
      },
      buildMenuList () {
        if (this.more) {
          for (let i = 0; i < this.menu.length; i++) {
            for (let j = 0; j < this.more.length; j++) {
              if (this.more[j] === this.menu[i].name) {
                this.menuList.push({
                  label: this.menu[i].label,
                  icon: this.menu[i].icon,
                  path: this.menu[i].path
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
        this.$emit('openFontSettings')
      },
      openSearch () {
        this.$emit('openSearch')
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
    .search {
      position: absolute;
      right: 37px;
      display: inline-block;
      height: 42px;
      width: 30px;
      line-height: 50px;
      img {
        width: 22px;
        height: 22px;
      }
    }
    .font {
      position: absolute;
      right: 67px;
      display: inline-block;
      height: 42px;
      width: 30px;
      line-height: 50px;
      img {
        width: 25px;
        height: 25px;
      }
    }
    .menu {
      position: absolute;
      right: 0;
      top: 42px;
      background: rgba(255, 255, 255, 0.95);
      width: 100%;
      z-index: 999;
      display: flex;
      .content {
        flex: 1;
        height: 70px;
        align-items: center;
        justify-content: center;
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        .menu-icon {
          width: 100%;
          img {
            height: 28px;
          }
        }
        .menu-word {
          width: 100%;
          margin-top: -20px;
          color: $w-gray;
          font-size: 14px;
        }
      }

    }
  }
  @media (min-width: 768px) {
    .notice {
      max-width: 700px;
    }
  }
</style>
