<template>
  <div class="announcement-template">
    <div class="content" v-if="acList.length" v-for="item in acList">
      <div class="right">
        <div class="name">{{item.title}}</div>
        <div class="words">
          {{item.content}}
        </div>
        <div class="time">{{item.date}}</div>
      </div>
    </div>
    <div class="blank" v-if="acList.length"></div>
    <blank v-if="!acList.length"></blank>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .announcement-template {
    margin-top: 48px;
    width: 100%;
    height: calc(100vh - 140px);
    .content {
      min-height: 100px;
      margin-bottom: 10px;
      background: white;
      display: flex;
      align-items: center;
      .right {
        margin-left: 20px;
        .name {
          color: $icon-blue;
          font-size: 14px;
          font-weight: 600;
        }
        .words {
          margin-right: 12px;
          margin-top: 5px;
          display: -webkit-box;
          display: -moz-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          -moz-box-orient: vertical;
          -moz-line-clamp: 2;
          overflow: hidden;
          font-size: 13px;
        }
        .time {
          text-align: right;
          color: $font-color;
          font-size: 14px;
          margin-right: 12px;
          margin-top: 7px;
        }
      }
    }
    .blank {
      width: 100%;
      height: 100px;
      background: $bg-gray;
    }
  }
</style>
<script>
  import blank from '../../blank/blank.vue'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    name: 'announcement',
    data () {
      return {
        acList: []
      }
    },
    components: {
      blank
    },
    created: function () {
      this.getData()
    },
    methods: {
      swipe (e) {
        if (e.direction === 'Right') {
          this.$router.push({name: 'message_promote', params: { user: this.$route.params.user }})
        }
      },
      getData () {
        Axios.get('/user/getAnnouncement')
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 800
              })
            } else {
              this.acList = response.data.result
              console.log(this.acList)
            }
          })
      }
    }
  }
</script>
