<template>
  <div class="start">
    <div class="menu">
      <div class="button-pen">
        <img src="../../img/icon/white_pen.png" />
      </div>
      <div class="button-book">
        <img src="../../img/icon/white_book.png" />
      </div>
      <div class="button-trail">
        <img src="../../img/icon/white_trail.png" />
      </div>
      <div class="button-search">
        <img src="../../img/icon/white_search.png" />
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
.start {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: $bg-gray;
  .menu {
    margin-top: 35%;
    margin-left: 12%;
    margin-right: 12%;
    display: flex;
    flex-wrap: wrap;
    .button-pen {
      background-color: $icon-red;
      width: 48%;
      margin: 1% 1% 1% 1%;
      border-radius: 10%;
      border: 5px solid white;
      box-sizing: border-box;
      img {
        width:50%;
        margin: 25% 25% 25% 25%;
      }
    }
    .button-book {
      background-color: $icon-purple;
      width: 48%;
      margin: 1% 1% 1% 1%;
      border-radius: 10%;
      border: 5px solid white;
      box-sizing: border-box;
      img {
        width:50%;
        margin: 30% 25% 20% 25%;
      }
    }
    .button-trail {
      background-color: $icon-light-green;
      width: 48%;
      margin: 1% 1% 1% 1%;
      border-radius: 10%;
      border: 5px solid white;
      box-sizing: border-box;
      img {
        width:50%;
        margin: 30% 25% 20% 25%;
      }
    }
    .button-search {
      background-color: $icon-light-yellow;
      width: 48%;
      margin: 1% 1% 1% 1%;
      border-radius: 10%;
      border: 5px solid white;
      box-sizing: border-box;
      img {
        width:50%;
        margin: 25% 25% 25% 25%;
      }
    }
  }
}
</style>

