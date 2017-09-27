<template>
  <div class="me">
    <div class="notice">
      <span class="icon">
        <img src="../img/icon/back.png">
      </span>
      <span class="title">
        我
      </span>
    </div>
    <div class="me-content">
      <div class="user-main">
        <div class="head-img">
          <img src="../img/photo/head.jpg">
        </div>
        <div class="words">
          <div class="name">沈皓清</div>
          <div class="sign">
            在乌云和尘埃之后是真理之光，他最终会投射出来并含笑驱散它们。
          </div>
          <div class="info">
            <img src="../img/icon/zan.png">
            <div>4399</div>
          </div>
        </div>
        <div class="icon">
          <img src="../img/icon/right.png">
        </div>
      </div>
      <div class="user-operation">
        <div class="line" v-for='item in operation'>
          <div class="left">
            <img :src='item.icon'>
          </div>
          <div class="right">
            <div class="words">
              {{item.name}}
            </div>
            <div class="icon">
              <img src="../img/icon/right.png">
            </div>
          </div>
        </div>
      </div>
      <div class="foot-menu">
        <div class="button">
          <img src="../img/icon/foot_begin.png">
          <div>开始</div>
        </div>
        <div class="discovery">
          <img src="../img/icon/foot_discovery.png">
        </div>
        <div class="button">
          <img src="../img/icon/foot_me.png">
          <div>我</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../scss/config";
  .me {
    height: 100%;
    background: $bg-gray;
    .notice {
      background: $main-color;
      height: 42px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      span{
        text-align: center;
        font-size: 16px;
      }
      img {
        position: absolute;
        top: 10px;
        left: 11px;
        width: 12px;
        height: 20px;
      }
    }
    .me-content {
      .user-main {
        height: 95px;
        background: white;
        display: flex;
        align-items: center;
        padding: 11px 11px 11px 12px;
        border-top: 1px solid $border-gray;
        border-bottom: 1px solid $border-gray;
        margin-top: 20px;
        .head-img{
          flex: 2;
          img {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            margin-left: 5px;
          }
        }
        .words {
          flex: 7;
          height: 100%;
          font-size: 15px;
          font-weight: 500;
          padding: 0 20px 0 20px;
          .name {
            margin-top: 8px;
          }
          .sign {
            margin-top: 11px;
            font-size: 13px;
            color: $w-gray;
          }
          .info {
            margin-top: 7px;
            font-size: 13px;
            color: $w-gray;
            img {
              width: 15px;
              height: 14px;
            }
            div {
              display: inline-block;
              margin-left: 8px;
              position: relative;
              top: -2px;
            }
          }
        }
        .icon {
          flex: 1;
          height: 100%;
          width: 100%;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          img {
            height: 25px;
            width: 14px;
          }
        }
      }
      .user-operation {
        margin-top: 30px;
        .line {
          display: flex;
          align-items: center;
          height: 50px;
          width: 100%;
          background: white;
          .left{
            flex: 1;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 32px;
              height: 32px;
            }
          }
          .right {
            flex: 4;
            display: flex;
            height: 100%;
            align-items: center;
            font-size: 15px;
            border-bottom: 1px solid $border-gray;
            .words {
              flex: 7;
              height: 100%;
              margin-left: 15px;
              line-height: 50px;
            }
            .icon {
              flex: 1;
              height: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              img {
                margin-right: 11px;
                width: 13px;
                height: 21px;
              }
            }
          }
          &:last-child{
            .right {
              border: none;
            }
          }
        }

      }
    }
    .foot-menu {
      width: 100%;
      height: 46px;
      background: white;
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
    .button{
      flex: 1;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      text-align: center;
      img {
        margin: 4px auto 0 auto;
        width: 21px;
        height: 21px;
      }
      font-size: 12px;
    }
    .discovery {
      flex: 2;
      img {
        position: absolute;
        top: -13px;
        left: 50%;
        width: 58px;
        height: 44px;
        margin-left: -29px;
      }
    }
    }
  }
</style>
<script>
  export default {
    data () {
      return {
        operation: [
          {
            name: '我的创作',
            icon: require('../img/icon/my_creation.png'),
            path: ''
          },
          {
            name: '我的订阅',
            icon: require('../img/icon/my_subscription.png'),
            path: ''
          },
          {
            name: '我的关注',
            icon: require('../img/icon/my_focus.png'),
            path: ''
          },
          {
            name: '我的好友',
            icon: require('../img/icon/my_friend.png'),
            path: ''
          },
          {
            name: '我的轨迹',
            icon: require('../img/icon/my_trail.png'),
            path: ''
          }
        ]
      }
    }
  }
</script>
