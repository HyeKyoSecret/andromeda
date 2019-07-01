<template>
  <div class="promote-template">
     <router-link tag="div" to='promote/fc' class="content">
       <div class="left-part">
         <img src="../../../img/icon/my_friend.png" alt="">
       </div>
       <div class="right-part">
         <div class="words">好友消息</div>
         <div class="new" v-if="state.friend">
           <div class="point"></div>
         </div>
       </div>
     </router-link>
    <router-link tag="div" to='promote/sub' class="content">
      <div class="left-part">
        <img src="../../../img/icon/my_subscription.png" alt="">
      </div>
      <div class="right-part">
        <div class="words">订阅消息</div>
        <div class="new" v-if="state.subscribe">
          <div class="point"></div>
        </div>
      </div>
    </router-link>
    <router-link tag="div" to='promote/cm' class="content">
      <div class="left-part">
        <img src="../../../img/icon/my_comment.png" alt="">
      </div>
      <div class="right-part">
        <div class="words">评论</div>
        <div class="new" v-if="state.comment">
          <div class="point"></div>
        </div>
      </div>
    </router-link>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .promote-template{
    margin-top:  48px;
    width: 100%;
    min-height: calc(100vh - 140px);
    .content {
      width: 100%;
      height: 55px;
      align-items: center;
      display: flex;
      background: white;
      margin-top: 8px;
      .left-part {
        flex: 1;
        margin-left: 16px;
        img {
          width: 36px;
        }
      }
      .right-part {
        flex: 8;
        margin-left: 12px;
        display: flex;
        .words {
          flex: 7;
        }
        .new {
          flex: 1;
          justify-content: center;
          align-items: center;
          display: flex;
          .point {
            width: 5px;
            height: 5px;
            border-radius: 1000px;
            background: $main-red;
          }
        }
      }
    }
  }
</style>
<script>
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    name: 'promote',
    data () {
      return {
        promoteList: [],
        state: {
          comment: false,
          subscribe: false,
          friend: false
        }
      }
    },
    watch: {
      '$route': function () {
        this.getData()
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      swipe (e) {
        if (e.target.className !== 'promote-template child-view') {
          return null
        }
        if (e.direction === 'Left') {
          this.$router.push({name: 'message_announcement', params: { user: this.$route.params.user }})
        } else if (e.direction === 'Right') {
          this.$router.push({name: 'message_request', params: { user: this.$route.params.user }})
        }
      },
      showUser (name) {
        Axios.post('/user/getUserByName', {
          name: name
        })
          .then(response => {
            if (!response.data.error) {
              this.$router.push(`/people/${response.data.id}`)
            } else {
              Toast({
                message: '发生错误',
                position: 'middle',
                duration: 1000
              })
            }
          })
      },
      getData () {
        Axios.get('/user/getPromoteState')
          .then(response => {
            if (response.data.error) {
              Toast({
                message: '发生错误',
                position: 'middle',
                duration: 1000
              })
            } else {
              this.state = response.data.result
            }
          })
      }
    }
  }
</script>
