<template>
  <div class="rs">
    <notice :title="result[0] ? result[0].title : '订阅消息'"></notice>
    <div class='preview-content'>
      <div class="story-preview" v-for="item in result" @click="goStory(item.storyId, item.rootId, item.id)">
        <div class="top"><span class="new" v-if="!item.readed"></span></div>
        <div class="content">{{item.content}}</div>
        <div class="info">
          <span><img src="../../../img/icon/gray_thumb.png" /></span>
          <span>{{item.zan}}</span>
          <span class="date">{{item.date}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import notice from '../../notice/notice'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        result: []
      }
    },
    components: {
      notice
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData () {
        Axios.get('/user/getRs', {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          this.result = response.data.result
        })
      },
      goStory (_id, rootId, id) {
        Axios.post('/user/changeReadState', {
          id: _id,
          rootId: rootId
        }).then(response => {
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          } else {
            this.$router.push('/story/' + id)
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../scss/config";
  .rs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: $bg-gray;
    min-height: calc(100vh - 58px);
    z-index: 998;
    .preview-content {
      margin-top: 52px;
      .story-preview {
        margin-top: 10px;
        width: 100%;
        background: white;
        &:last-child:after {
          content: '';
          display: block;
          height: 100px;
          width: 100%;
          background: $bg-gray;
        }
        .content {
          width: 95%;
          margin: 0 auto;
          min-height: 28px;
          display: -webkit-box;
          display: -moz-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          -moz-box-orient: vertical;
          -moz-line-clamp: 3;
          overflow: hidden;
          font-size: 14px;
          color: $font-dark;
        }
        .top {
          height: 20px;
          .new {
            position: absolute;
            margin-top: 10px;
            right: 8px;
            width: 8px;
            height: 8px;
            border-radius: 1000px;
            background: $main-red;
          }
        }
        .info {
          height: 30px;
          line-height: 30px;
          margin-top: 15px;
          border-top: 1px solid $bg-gray;
          text-align: right;
          font-size: 14px;
          color: $font-gray;
          img {
            width: 14px;
          }
          .date {
            margin-left: 15px;
            margin-right: 15px;
          }
        }
      }
    }
  }
</style>
