<template>
    <div class="fc">
      <notice title="好友消息"></notice>
      <div class="promoteList" v-if="promoteList.length">
        <div class="pr-content" v-if="item.vis" v-for='(item, index) in promoteList'>
          <mt-cell-swipe class='pr'
                         :right="[
          {
            content: '删除',
            style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'},
            handler: function () {
              return deletePromote(index, item.id)
            }
          }
        ]">
            <div class='add-request'>
              <span class="title" @click.self="showUser(item.content_1)">{{item.content_1}}</span>
              <span class="info">{{item.content_2}} <label class='novel-name' v-if="item.description === 'recommend'" @click="goStory(item.content_4)">《{{item.content_3}}》</label></span>
              <span class="date">{{item.date}}</span>
            </div>
          </mt-cell-swipe>
        </div>
      </div>
      <blank v-if="!promoteList.length"></blank>
    </div>
</template>

<script>
  import Axios from 'axios'
  import notice from '../../notice/notice'
  import blank from '../../blank/blank.vue'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    name: 'fc',
    components: {
      blank,
      notice
    },
    data () {
      return {
        promoteList: []
      }
    },
    watch: {
      '$route' (to, from) {
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
        Axios.get('/user/getPromote')
          .then(response => {
            this.promoteList = response.data.result
            this.promoteList = this.promoteList.reverse()
          })
      },
      deletePromote (index, id) {
        MessageBox.confirm('确定删除吗？').then(action => {
          if (action === 'confirm') {
            Axios.post('/user/delPendingPromote', {
              id: id
            }).then(response => {
              if (response.data.error) {
                Toast({
                  message: response.data.message,
                  position: 'middle',
                  duration: 1000
                })
              } else {
                this.promoteList[index].vis = false
              }
            })
          }
        }).catch(cancel => {
          return null
        })
      },
      goStory (id) {
        this.$router.push(`/story/${id}`)
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../scss/config";
  .mint-cell-wrapper {
    background: none;
  }
  .fc{
    position: absolute;
    z-index: 997;
    top: 0;
    left: 0;
    width: 100%;
    min-height: calc(100vh - 58px);
    background: $bg-gray;
  .promoteList {
    margin-top: 50px;
  &:last-child {
     padding-bottom: 100px;
   }
  }
  .pr-content {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $border-gray;
    margin-top: 10px;
  &:last-child {
     border: none;
   }
  .pr {
    width: 100%;
    height: 48px;
    background: white;
    color: $icon-blue;
    font-weight: 600;
    font-size: 14px;
  .add-request {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 16px;
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
    font-size: 12px;
    display: inline-block;
    height: 16px;
  }
  .date {
    /*display: inline-flex;*/
    height: 50px;
    margin-left: 3px;
    font-size: 12px;
    flex: 1;
    line-height: 50px;
    margin-right: 3px;
  }
  .title {
    color: $icon-blue;
    font-weight: 600;
    font-size: 12px;
    flex: 2;
    text-align: center;
  }
  .info {
    flex: 5;
    text-align: center;
  .novel-name {
    color: $icon-blue;
    font-weight: 600;
    font-size: 14px;
  }
  }
  }
  }
  }
  .mint-cell-title {
    flex: 0;
    text-align: center;
    margin-left: 5px;
  }
  .mint-cell-value {
    flex: 4.5;
  }
  }

</style>
