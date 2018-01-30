<template>
  <div>
    <div v-if="requestList.request.length">
      <div class="label">待验证请求</div>
      <div v-for='item in requestList.request' class="request-template" v-swipe="{methods: swipe}">
        <div class="rq-content">
          <mt-cell-swipe class='rq'
                         title=""
                         :right="[
          {
            content: '删除',
            style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'}
          }
        ]">
            <slot>
              <div class='add-request'>
                <span class="title">{{item.to}}</span>
                <span class="info">请求已发送</span>
                <div class="date">{{item.date}}</div>
                <div class="date">验证中……</div>
              </div>
            </slot>
          </mt-cell-swipe>
        </div>
      </div>
    </div>
    <div v-if="requestList.addFriend.length">
      <div class="label">待处理请求</div>
      <div v-for='item in requestList.addFriend' class="request-template" v-swipe="{methods: swipe}">
        <div class="rq-content">
          <mt-cell-swipe class='rq'
                         title= ''
                         :right="[
          {
            content: '删除',
            style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'}
          }
        ]">
            <slot>
              <div class='add-request'>
                <span class="title">{{item.from}}</span>
                <span class="info">添加您为好友</span>
                <div class="date">{{item.date}}</div>
                <span class='pass-btn' ><span @click="acceptFriend"class="btn">通过</span></span>
                <!--<span class="confirm">已通过</span>-->
              </div>
            </slot>
          </mt-cell-swipe>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .request-template {
    margin-top: 5px;
    width: 100%;
    height: 100%;
    .rq-content {
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid $border-gray;
      &:last-child {
        border: none;
        /*margin-bottom: 70px;*/
      }
      .rq {
        width: 100%;
        height: 50px;
        background: white;
        color: $icon-blue;
        font-weight: 600;
        font-size: 14px;
        .add-request {
          line-height: 50px;
          width: 100%;
          display: flex;
          justify-content: center;
          .pass-btn {
            flex: 1;
            text-align: center;
          }
          .btn {
            width: 70px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 5px;
            font-size: 14px;
            letter-spacing: 3px;
            color: #ffffff;
            background: $main-color;
            padding: 5px 9px 5px 9px;
          }
          .confirm {
            width: 60px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 5px;
            font-size: 14px;
            letter-spacing: 3px;
            color: $w-gray;
            background: $bg-gray;
            padding: 5px 9px 5px 9px;
          }
          span {
            margin-left: 5px;
            font-size: 12px;
          }
          .date {
            display: inline-flex;
            height: 50px;
            margin-left: 5px;
            font-size: 12px;
            flex: 1;
          }
          .title {
            color: $icon-blue;
            font-weight: 600;
            font-size: 14px;
            flex: 1;
            text-align: center;
          }
          .info {
            flex: 1;
          }
        }
      }
    }
  }
  .label {
    margin-top: 15px;
    margin-left: 5px;
    color: $w-gray;
  }
</style>
<script>
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    name: 'request',
    data () {
      return {
        requestList: {
          request: [],
          addFriend: []
        }
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      swipe (e) {
        if (e.target.className !== 'request-template child-view') {
          return null
        }
        if (e.direction === 'Left') {
          this.$router.push({name: 'message_promote'})
        } else if (e.direction === 'Right') {
          this.$router.push({name: 'message_words'})
        }
      },
      getData () {
        Axios.get('/user/getPendingList', {
          params: {
            id: this.$route.params.user
          }
        })
          .then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              this.requestList = response.data.result
            }
          })
      },
      acceptFriend () {
        Axios.get('/user/acceptFriend', {
          id: this.$route.parmas.user
        })
          .then(response => {
            console.log(response.data)
          })
      }
    }
  }
</script>
