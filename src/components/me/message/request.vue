<template>
  <div class="request-template">
    <div v-if="requestList.request.length">
      <div class="label">待验证请求</div>
      <div v-for='(item, index) in requestList.request' class="request-template">
        <div class="rq-content" v-if='item.vis'>
          <mt-cell-swipe class='rq'
                         :title= item.to
                         :right="[
          {
            content: '删除',
            style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'},
            handler: function () {
              return deleteRequest(index, item.toId)
            }
          }
        ]">
            <slot>
              <div class='add-request'>
                <span class="info">请求已发送</span>
                <span class="date">{{item.date}}</span>
                <span class="date">验证中···</span>
              </div>
            </slot>
          </mt-cell-swipe>
        </div>
      </div>
    </div>
    <div v-if="requestList.addFriend.length">
      <div class="label">待处理请求</div>
      <div v-for='(item, index) in requestList.addFriend' :key="item.fromId">
        <div class="rq-content" v-if='item.vis'>
          <mt-cell-swipe class='rq'
                         :title= item.from
                         :right="[
          {
            content: '删除',
            style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'},
            handler: function () {
              return deleteAdd(index, item.fromId)
            }
          }
        ]">
          <div class='add-request'>
            <span class="info">添加您为好友</span>
            <div class="date">{{item.date}}</div>
            <span v-if = "item.state === 'pending'" class="btn" @click="acceptFriend(item.fromId)">通过</span>
          </div>
          </mt-cell-swipe>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss'>
  @import "../../../scss/config";
  .rq-content .mint-cell-title {
    flex: 1;
    text-align: center;
  }
  .request-template {
    width: 100%;
    min-height: calc(100vh - 82px);
    .label {
      margin-bottom: 5px;
    }
    .rq-content {
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid $border-gray;
      margin-top: 5px;
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
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .pass-btn {
            flex: 1;
            text-align: center;
          }
          .btn {
            width: 60px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 5px;
            font-size: 14px;
            letter-spacing: 2px;
            color: #ffffff;
            background: $main-color;
            margin-right: 8px;
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
            margin-right: 8px;
          }
          span {
            margin-left: 5px;
            font-size: 12px;
          }
          .date {
            /*display: inline-flex;*/
            height: 50px;
            margin-left: 3px;
            font-size: 12px;
            flex: 1;
            line-height: 50px;
            text-align: center;
          }
          .title {
            color: $icon-blue;
            font-weight: 600;
            font-size: 14px;
            flex: 1;
            text-align: center;
            overflow: hidden;
          }
          .info {
            flex: 1;
            text-align: center;
          }
        }
      }
    }
    .label {
      margin-top: 15px;
      margin-left: 5px;
      color: $w-gray;
    }
  }
</style>
<script>
  import Axios from 'axios'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    name: 'request',
    data () {
      return {
        requestList: {
          request: [],
          addFriend: []
        },
        count: 0,
        qwert: '333333'
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
          this.$router.push({name: 'message_promote', params: { user: this.$route.params.user }})
        } else if (e.direction === 'Right') {
          this.$router.push({name: 'message_words', params: { user: this.$route.params.user }})
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
      acceptFriend (fromId) {
        Axios.get('/user/acceptFriend', {
          params: {
            id: this.$route.params.user,
            fromId: fromId
          }
        })
          .then(response => {
            if (!response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
              this.getData()
            } else {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            }
          })
      },
      deleteAdd (index, fromId) {
        MessageBox.confirm('确定删除吗？').then(action => {
          if (action === 'confirm') {
            Axios.post('/user/delPendingAdd', {
              fromId: fromId
            }).then(response => {
              if (response.data.error) {
                Toast({
                  message: response.data.message,
                  position: 'middle',
                  duration: 1000
                })
              } else {
                this.requestList.addFriend[index].vis = false
              }
            })
          }
        }).catch(cancel => {
          return
        })
      },
      deleteRequest (index, toId) {
        MessageBox.confirm('确定删除吗？').then(action => {
          if (action === 'confirm') {
            Axios.post('/user/delPendingReq', {
              toId: toId
            }).then(response => {
              if (response.data.error) {
                Toast({
                  message: response.data.message,
                  position: 'middle',
                  duration: 1000
                })
              } else {
                this.requestList.request[index].vis = false
              }
            })
          }
        }).catch(cancel => {
          return
        })
      }
    }
  }
</script>
