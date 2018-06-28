<template>
  <div class="notice">
    <span class="icon" @click="goBack">
      <img src="../../img/icon/back.png">
    </span>
    <span class="title">
      {{title}}
    </span>
    <span class="more" v-if="more" @click="show">
      <img src="../../img/icon/more.png" alt="">
    </span>
    <div v-if="more" class="menu">
      <div class="entry-trangle-top"></div>
      <div class="content" v-for="item in menuList">
        <span class="menu-icon"><img :src="item.icon" alt="">
        </span><span class="menu-word">{{item.label}}</span>
      </div>
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
            name: 'bookMark',
            label: '添加书签',
            icon: require('../../img/icon/bookmark.png')
          },
          {
            name: 'report',
            label: '举报',
            icon: require('../../img/icon/report.png')
          }
        ],
        menuList: []
      }
    },
    created: function () {
      // this.buildMenuList()
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      buildMenuList () {
        if (this.more) {
          for (let i = 0; i < this.menu.length; i++) {
            for (let j = 0; i < this.more.length; j++) {
              if (this.more[j] === this.menu[i].name) {
                this.menuList.push({
                  label: this.menu[i].label,
                  icon: this.menu[i].icon
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
    background: $main-color;
    height: 42px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      text-align: center;
      font-size: 16px;
    }
    .icon {
      position: absolute;
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
    .more {
      position: absolute;
      right: 6px;
      display: inline-block;
      height: 42px;
      width: 30px;
      line-height: 50px;
      img {
        width: 25px;
        height: 20px;
      }
    }
    .menu {
      position: absolute;
      right: 3px;
      top: 45px;
      background: white;
      width: 100px;
      .entry-trangle-top{
        position:absolute;
        top:-10px;
        left:80px;
        width:0;
        height:0;
        border-left:10px solid transparent;
        border-right:10px solid transparent;
        border-bottom:10px solid #fff;
      }
      .content {
        border-bottom: 1px solid $line-gray;
        &:last-child {
          border: none;
        }
        height: 40px;
        width: 100%;
        line-height: 40px;
        text-align: center;
        display: inline-flex;
        .menu-icon {
          flex: 2;
          img {
            vertical-align: middle;
            width: 20px;
            margin-left: 5px;
          }
        }
        .menu-word {
          flex: 5;
          color: $w-gray;
          font-size: 14px;
        }
      }

    }
  }
</style>
