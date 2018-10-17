<template>
  <div class="start" @click.self="goBack">
    <div class="menu">
      <router-link tag='div' :to="item.path" :class="item.class" v-for="item in menu" :key="item.class">
        <img :src="item.img" />
      </router-link>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
.start {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: $bg-gray;
  .menu {
    margin-top: 35%;
    margin-left: 12%;
    margin-right: 12%;
    display: flex;
    flex-wrap: wrap;
    .button-pen {
      background-color: $icon-red;
      width: 48%;
      margin: 1% 1% 1% 1%;
      border-radius: 10%;
      border: 5px solid white;
      box-sizing: border-box;
      img {
        width:50%;
        margin: 25% 25% 25% 25%;
      }
    }
    .button-book {
      background-color: $icon-purple;
      width: 48%;
      margin: 1% 1% 1% 1%;
      border-radius: 10%;
      border: 5px solid white;
      box-sizing: border-box;
      img {
        width:50%;
        margin: 30% 25% 20% 25%;
      }
    }
    .button-trail {
      background-color: $icon-light-green;
      width: 48%;
      margin: 1% 1% 1% 1%;
      border-radius: 10%;
      border: 5px solid white;
      box-sizing: border-box;
      img {
        width:50%;
        margin: 30% 25% 20% 25%;
      }
    }
    .button-search {
      background-color: $icon-light-yellow;
      width: 48%;
      margin: 1% 1% 1% 1%;
      border-radius: 10%;
      border: 5px solid white;
      box-sizing: border-box;
      img {
        width:50%;
        margin: 25% 25% 25% 25%;
      }
    }
  }
}
</style>
<script>
  import Axios from 'axios'
  export default {
    data () {
      return {
        menu: [
          {
            class: 'button-pen',
            path: '/buildStory',
            img: require('../../img/icon/white_pen.png')
          },
          {
            class: 'button-book',
            path: '',
            img: require('../../img/icon/white_book.png')
          },
          {
            class: 'button-trail',
            path: ``,
            img: require('../../img/icon/white_trail.png')
          },
          {
            class: 'button-search',
            path: '/search',
            img: require('../../img/icon/white_search.png')
          }
        ],
        userId: ''
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      getData () {
        Axios.get('/register/checkLogin')
          .then(response => {
            if (response.data.login) {
              this.userId = response.data.user
              this.menu[1].path = `/people/${this.userId}/subscribe`
              this.menu[2].path = `/people/${this.userId}/history`
            }
          })
      }
    }
  }
</script>
