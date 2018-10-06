<template>
  <div class="history">
    <notice :title="title" class="notice"></notice>
    <div v-infinite-scroll="getData"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10"
         class="history-content">
      <div class="one-day" v-for="(day, index) in history">
        <div class="title">{{day.date}}</div>
        <div class="story-pack" v-for="(rootPack, index2) in day.rootPack">
          <div class="left">
            <div class="icon"><img src="../../img/icon/time.png"></div>
            <div class="time">{{rootPack.update}}</div>
          </div>
          <div class="right">
            <div class="root-list" @click="showDetails(index, index2)">
              <div class="circle"></div>
              <div class="package">
                <div class="root-cover"><img :src="rootPack.coverImg" alt=""></div>
                <div class="root-name">{{rootPack.rootId}}</div>
                <div class="records">
                  <div><img src="../../img/icon/records.png" alt=""></div>
                  <div>{{rootPack.story.length}}</div>
                </div>
              </div>
            </div>
            <div class="story-list" v-if="rootPack.showList">
              <div class="story" v-for="story in rootPack.story" @click="goStory(story.storyId)">
                <div class="date">{{story.date}}</div>
                <div class="brief">
                  {{story.brief}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <foot-menu></foot-menu>
  </div>
</template>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import notice from '../../components/notice/notice.vue'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    components: {
      FootMenu,
      notice
    },
    data () {
      return {
        title: '我的轨迹',
        history: []
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData () {
        Axios.get('/user/getHistory', {
          params: {
            id: this.$route.params.user,
            val: this.history ? parseInt(this.history.length / 2) : 0
          }
        }).then(response => {
          if (response.data.error) {
            Toast({
              position: 'middle',
              message: response.data.message,
              duration: 1000
            })
          } else {
            for (let i = 0; i < response.data.result.length; i++) {
              let exist = this.history.some(function (item) {
                return item.date === response.data.result[i].date
              })
              if (!exist) {
                this.history.push(response.data.result[i])
              }
            }
          }
        })
      },
      showDetails (index, index2) {
        this.history[index].rootPack[index2].showList = !this.history[index].rootPack[index2].showList
        Axios.post('/story/getStoryBrief', {
          story: this.history[index].rootPack[index2].story
        }).then(response => {
          if (response.data.error) {

          } else {
            let temp = this.history[index]
            for (let i = 0; i < response.data.result.length; i++) {
              temp.rootPack[index2].story[i].brief = response.data.result[i]
            }
            this.$set(this.history, index, temp)
          }
        })
      },
      goStory (id) {
        this.$router.push('/story/' + id)
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../scss/config";
  .history {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: $bg-gray;
    .notice {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 999;
    }
    .history-content {
      margin-top: 60px;
      margin-left: 40px;
      min-height: calc(100vh - 110px);
      border-left: 1px solid $line-gray;
      .one-day {
        &:last-child:after {
          content: '';
          display: block;
          height: 100px;
          width: 100%;
        }
        .title {
          border-bottom: 1px solid $line-gray;
          font-size: 22px;
          margin-left: 8px;
          padding-bottom: 8px;
          color: $font-dark;
        }
        .story-pack {
          margin-top: 15px;
          margin-bottom: 15px;
          .left {
            position: absolute;
            left: 25px;
            .icon {
              background: $bg-gray;
              width: 25px;
              height: 25px;
              border-radius: 2000px;
            }
            .time {
              background: $main-color;
              color: #ffffff;
              padding: 1px 5px 1px 5px;
              border-radius: 5px;
              width: 42px;
              text-align: center;
              margin-left: -10px;
              margin-top: 15px;
            }
            img {
              width: 30px;
            }
          }
          .right {
            width: 80%;
            margin-left: 40px;
            min-height: 80px;
            background: white;
            display: flex;
            align-items: center;
            flex-direction: column;
            .root-list {
              min-height: 80px;
              width: 100%;
              display: flex;
              align-items: center;
              .circle {
                width: 10px;
                height: 10px;
                background: $bg-gray;
                border-radius: 2000px;
                margin-left: 12px;
                border: 1px solid $line-gray;
              }
              .package {
                width: 100%;
                display: flex;
                align-items: center;
                img {
                  flex: 2;
                  margin-left: 14px;
                  margin-top: 3px;
                  width: 42px;
                  height: 56px;
                }
                .root-name {
                  flex: 7;
                  margin-left: 15px;
                  color: $font-dark;
                }
                .records {
                  flex: 2;
                  display: flex;
                  align-items: center;
                  color: $font-gray;
                  margin-right: 10px;
                  img{
                    vertical-align: middle;
                    margin-right: 7px;
                    margin-top: -1px;
                    width: 22px;
                    height: 22px;
                  }
                }
              }
            }
            .story-list {
              width: 96%;
              text-align: left;
              box-sizing: border-box;
              color: $font-gray;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              .story {
                display: flex;
                width: 100%;
                height: 40px;
                border-top: 1px solid $line-gray;
                align-items: center;
                .brief {
                  width: 78%;
                  padding-left: 5px;
                  box-sizing: border-box;
                  display: -webkit-box;
                  display: -moz-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  -moz-box-orient: vertical;
                  -moz-line-clamp: 1;
                  overflow: hidden;
                }
                .date {
                  display: inline-block;
                  width: 22%;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
