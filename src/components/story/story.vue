<template>
 <div class="story-component">
   <div class="related-info">
     <div class="author-info">
       <div class="like">
         <router-link :to='storyInfo.authorId' tag="span">{{storyInfo.author}}</router-link>
         <span v-if="showFocus">
            <img src="../../img/icon/redheart.png" v-if="hasFocus"/>
            <img src="../../img/icon/zan.png" v-else>
         </span>
         <span v-else class="blank"></span>
         <span class="time">{{storyInfo.date}}</span>
       </div>
     </div>
   </div>
   <div class="context" :key="id"><p v-for="item in storyInfo.content">{{item}}</p><div class="blankP"></div></div>
 </div>
</template>
<script>
    export default {
      name: 'story',
      data () {
        return {
          // enterTransition: 'animated fadeInLeft',
          // leaveTransition: 'animated fadeOutRight'
        }
      },
      props: ['storyInfo', 'id', 'showFocus', 'hasFocus']
    }
</script>

<style scoped lang="scss">
  @import "../../scss/animate.min.css";
  .story-component {
    padding-top: 42px;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .blankP {
      width: 100%;
      height: 80px;
    }
  }
  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }


</style>
