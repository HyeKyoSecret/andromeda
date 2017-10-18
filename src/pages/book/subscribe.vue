<template>
  <div class="subscribe">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        订阅
      </span>
    </div>
    <div class="show-story">
      <div class="background">
        <div class="left-part"><img src="../../img/photo/LegendofZelda.png" /></div>
        <div class="right-part">
          <div class="already-read">
              <img src="../../img/icon/already_read.png" />
              <div class="read-amount">918</div>
          </div>
          <div class="story-name">塞尔达传说</div>
          <div class="quantity">
            <img src="../../img/icon/gray_flag.png" />
            <div class="amount">4985篇</div>
          </div>
          <div class="quantity">
           <img src="../../img/icon/gray_book.png"/>
            <div class="amount">155人</div>
          </div>
          <div class="quantity">
            <img src="../../img/icon/gray_pen.png" />
            <div class="amount">55篇</div>
          </div>
          <div class="continue-read">
            继续阅读
          </div>
        </div>
      </div>
    </div>
    <div class="shelf">
      <div class="book">
        <div class="cover"><img src="../../img/photo/LegendofZelda.png" /></div>
        <div class="progress-bar"></div>
        <div class="name">塞尔达传说</div>
      </div>
      <div class="book">
        <div class="cover"><img src="../../img/photo/LegendofZelda.png" /></div>
        <div class="progress-bar"></div>
        <div class="name">塞尔达传说</div>
      </div>
      <div class="book">
        <div class="cover"><img src="../../img/photo/LegendofZelda.png" /></div>
        <div class="progress-bar"></div>
        <div class="name">塞尔达传说</div>
      </div>
    </div>
    <div class="shelf">
      <div class="book">
        <div class="cover"><img src="../../img/photo/LegendofZelda.png" /></div>
        <div class="progress-bar"></div>
        <div class="name">塞尔达传说</div>
      </div>
      <div class="book">
        <div class="cover"><img src="../../img/photo/LegendofZelda.png" /></div>
        <div class="progress-bar"></div>
        <div class="name">塞尔达传说</div>
      </div>
      <div class="book">
        <div class="cover"><img src="../../img/photo/LegendofZelda.png" /></div>
        <div class="progress-bar"></div>
        <div class="name">塞尔达传说</div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .subscribe {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: $bg-gray;
    .notice {
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        text-align: center;
        font-size: 16px;
      }
      .icon {
        position: absolute;
        left: 8px;
        display: inline-block;
        height: 42px;
        width: 30px;
        line-height: 50px;
        img {
          width: 12px;
          height: 20px;
        }
      }
    }
    .show-story {
      margin: 20px auto 0 auto;
      width: 90%;
      /*      height: 240px;*/
      font-size: 0;
      .background {
        width: 100%;
        height: 100%;
        background-color: white;
        .left-part {
          width: 50%;
          display: inline-block;
          img {
            width: 100%;
          }
        }
        .right-part {
          width: 50%;
          display: inline-block;
          vertical-align: top;
          .already-read {
            text-align: right;
            position: relative;
            img {
              width: 25%;
            }
            .read-amount {
              position: absolute;
              top: 50%;
              right: 15%;
              font-size: 12px;
              color: $font-gray;
            }
          }
          .story-name {
            font-size: 18px;
            font-weight: 700;
            text-align: center;
          }
          .quantity {
            margin-left: 20%;
            margin-top: 10%;
            border-bottom: 1px solid $line-gray;
            img {
              display: inline-block;
              width: 10%;
            }
            .amount {
              display: inline-block;
              font-size: 12px;
              color: $font-gray;
              margin-left: 20%;
            }
          }
          .continue-read {
            margin-top:12px;
            margin-left: 25%;
            margin-right: 25%;
            height :20px;
            background-color: #00db75 ;
            font-size: 12px;
            border-radius: 5px;
            color: white;
            text-align: center;
          }
        }
      }
    }
    .shelf {
      margin-top: 20px;
      border-bottom: 1px solid $line-gray;
      display: flex;
      .book {
        flex: 1;
        text-align: center;
        font-size: 0;
        .cover {
          width:60%;
          height: auto;
          margin-left: 20%;
          margin-right: 20%;
          img{
            width: 100%;
          }
        }
        .progress-bar {
          margin-left: 20%;
          margin-right: 20%;
          height: 2px;
          background-color: #00db75;
        }
        .name {
          font-size: 14px;
          color: $font-dark;
        }
      }
    }
  }

</style>
