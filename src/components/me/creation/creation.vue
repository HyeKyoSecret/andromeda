<template>
  <mt-loadmore :top-method="loadTop" class="my-creation-content" ref="loadmore"
       v-infinite-scroll="loadMore"
       infinite-scroll-disabled = true
       infinite-scroll-distance = "10">
    <router-link :to="item.path" tag='div' class="one-story" v-for="(item, index) in story" :key="item.name">
      <div class="story-information">
        <div class="cover">
          <div><img :src="item.cover" @error="setErrorImg(index)"/></div>
          <div class="story-quantity">
            <span><img src="../../../img/icon/graybook.png" /></span>
            <span class="number">{{item.readCounts}}</span>
          </div>
          <div class="story-quantity">
            <span><img src="../../../img/icon/gray_flag.png" /></span>
            <span class="number">{{item.nodeCounts}}</span>
          </div>
        </div>
        <div class="right-part">
          <div class="story-name">
            <span class="name">{{item.name}}</span>
            <span class="owner" v-if="item.isRoot">创建人</span>
          </div>
          <div class="info-quantity">
            <span><img src="../../../img/icon/gray_pen.png" /></span>
            <span>{{item.num}}篇</span>
          </div>
          <div class="info-quantity">
            <span><img src="../../../img/icon/gray_thumb.png" /></span>
            <span>{{item.zanCounts}}次</span>
          </div>
          <div class="last-write-time">
            最后创作时间：{{item.latestDate}}
          </div>
        </div>
      </div>
    </router-link>
  </mt-loadmore>
</template>
<script>
  export default {
    name: 'creation',
    props: ['story', 'type'],
    methods: {
      loadMore () {
        if (this.story.length > 0) {
          if (this.story[0].isRoot === 'root') {
            this.$emit('loadMore', 'root')
          } else {
            this.$emit('loadMore', 'story')
          }
        }
      },
      loadTop () {
        if (this.type) {
          this.$emit('refresh', 'root')
        } else {
          this.$emit('refresh', 'story')
        }
        this.$refs.loadmore.onTopLoaded()
      },
      setErrorImg (x) {
        this.story[x].cover = require('../../../img/photo/defaultPic.png')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../scss/config";
  .my-creation-content {
    margin-top: 25px;
  }
  .one-story {
    height: 140px;
    width: 100%;
    background-color: white;
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 100px;
    }
    .story-information {
      margin-left: 10px;
      margin-right: 10px;
      height: 100px;
      display: flex;
      align-items:flex-start;
      .cover {
        margin-top: 10px;
        flex: 1;
        img {
          height: 88px;
          width: 66px;
        }
        .story-quantity {
          height: 18px;
          img{
            height: 15px;
            width: 15px;
            margin-left: 5px;
            vertical-align: text-bottom;
          }
          .number {
            margin-left: 3px;
            color: $font-gray;
            font-size: 12px;
          }
        }
      }
      .right-part {
        margin-top: 8px;
        flex: 3;
        .story-name {
          color: $font-dark;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          .name {
            flex:3;
            text-align: left;
          }
          .owner {
            margin-left: 50px;
            flex: 1;
            text-align: center;
            height: 20px;
            border:1px solid $icon-red;
            border-radius: 5px;
            font-size: 14px;
            color: $icon-red;
            font-weight: normal;
          }
        }
        .info-quantity {
          margin-top: 10px;
          font-size: 14px;
          color: $font-gray;
          img {
            width:18px;
            height:18px;
            vertical-align: text-bottom;
            margin-right: 5px;
          }
        }
        .last-write-time {
          margin-top: 20px;
          color: $font-gray;
          font-size: 14px;
        }
      }
    }
  }
</style>
