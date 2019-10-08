<template>
 <div class="story-component">
   <div class="context" :key="id"><p v-for="item in storyInfo.content">{{item}}</p></div>
   <div class="related-info">
     <div class="author-info">
       <div class="like">
         <router-link :to='storyInfo.authorId' tag="span">作者:&nbsp;{{storyInfo.author}}</router-link>
         <span v-if="showFocus">
            <img src="../../img/icon/redheart.png" v-if="hasFocus"/>
            <img src="../../img/icon/zan.png" v-else>
         </span>
         <span v-else class="blank"></span>
       </div>
       <div class="time">{{storyInfo.date}}</div>
     </div>
   </div>
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
    height: calc(100vh - 42px);
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
