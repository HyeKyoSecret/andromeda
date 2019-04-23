<template>
  <div class="notice">
    <span class="icon" @click="goBack">
      <img src="../../img/icon/back.png">
    </span>
    <span class="title">
      {{title}}
    </span>
    <span class="mark" v-if="more">
      <img src="../../img/icon/mark.png" alt="">
    </span>
    <span class="mark" v-if="more">
      <img src="../../img/icon/mark_active.png" alt="">
    </span>
    <span class="search" v-if="more">
      <img src="../../img/icon/search.png" alt="">
    </span>
    <span class="font" v-if="more">
      <img src="../../img/icon/font.png" alt="">
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
  export default {
    props: ['title', 'more'],
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
        menuActive: false
      }
    },
    created: function () {
      this.buildMenuList()
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      showMenu () {
        this.menuActive = !this.menuActive
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
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
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
      right: 34px;
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
      right: 60px;
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
/*      .entry-triangle-top{
        position:absolute;
        top: -9px;
        left:80px;
        width:0;
        height:0;
        border-left:10px solid transparent;
        border-right:10px solid transparent;
        border-bottom:10px solid #fff;
      }*/
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
