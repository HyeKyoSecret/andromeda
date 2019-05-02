<template>
    <div class="mark">
      <notice title="书签"></notice>
      <div class="one-mark" v-for="item in mark" @click="goStory(item.id)">
        <div class="markId">{{item.id}}</div>
        <div class="markContent">{{item.content}}</div>
        <div class="markDate">添加时间： {{item.date}}</div>
      </div>
    </div>
</template>
<script>
  import notice from '../../../components/notice/notice.vue'
  import Axios from 'axios'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        mark: [],
        id: this.$route.params.id
      }
    },
    methods: {
      getData () {
        Axios.get('/story/getMark', {
          params: {
            id: this.id
          }
        }).then(response => {
          if (response.data.error) {
            Toast({
              position: 'middle',
              message: response.data.message,
              duration: 1000
            })
          } else {
            this.mark = response.data.result
          }
        })
      },
      goStory (id) {
        this.$router.push(`/story/${id}`)
      }
    },
    created: function () {
      this.getData()
    },
    components: {
      notice
    }
  }
</script>
<style lang='scss' scoped>
  @import "../../../scss/config";
 .mark {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   background: $bg-gray;
   min-height: calc(100vh - 42px);
   margin-top: 42px;
   .one-mark {
     width: 100%;
     background: white;
     margin-top: 10px;
     font-size: 13px;
     .markId {
       padding-left: 10px;
       color: $font-dark;
       height: 21px;
       line-height: 21px;
     }
     .markContent {
       height: 30px;
       line-height: 30px;
       padding-left: 10px;
       color: $font-dark;
       display: -webkit-box;
       display: -moz-box;
       -webkit-box-orient: vertical;
       -webkit-line-clamp: 1;
       -moz-box-orient: vertical;
       -moz-line-clamp: 1;
       overflow: hidden;
     }
     .markDate {
       line-height: 20px;
       height: 20px;
       border-top: 1px solid $border-gray;
       text-align: right;
       padding-right: 10px;
       color: $font-gray;
     }
     &:last-child:after {
       content: '';
       height: 100px;
       background: $bg-gray;
       display: block;
     }
   }
 }
</style>
