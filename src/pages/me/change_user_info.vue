<template>
  <div class="change-user-info">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        我
      </span>
    </div>
    <div class="me-content">
      <div class="user-main">
        <div class="head-img">
          <img src="../../img/photo/head.jpg">
        </div>
        <div class="words">
          <div class="name">沈皓清</div>
          <div class="sign">
            在乌云和尘埃之后是真理之光，他最终会投射出来并含笑驱散它们。
          </div>
        </div>
        <div class="icon">
          <img src="../../img/icon/right.png">
        </div>
      </div>
      <div class="user-operation">
        <div class="line" v-for='item in operation'>
          <div class="left">
            {{item.title}}
          </div>
          <div class="right">
            <div class="words">
              666666
            </div>
            <div class="icon">
              <img src="../../img/icon/right.png">
            </div>
          </div>
        </div>
      </div>
      <div class="quit">
        退出账号
      </div>
      <div class="foot-menu">
        <div class="button">
          <img src="../../img/icon/foot_begin.png">
          <div>开始</div>
        </div>
        <div class="discovery">
          <img src="../../img/icon/foot_discovery.png">
        </div>
        <div class="button">
          <img src="../../img/icon/foot_me.png">
          <div>我</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
  .change-user-info {
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
    height: 42px;
    width: 100%;
    background: white;
  .left{
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 25px;
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
    text-align: right;
    padding-right: 20px;
    font-size: 14px;
  }
  .icon {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  img {
    margin-right: 11px;
    width: 12px;
    height: 20px;
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
  .quit {
    width: 100%;
    height: 42px;
    color: red;
    background: white;
    margin-top: 60px;
    line-height: 42px;
    text-align: center;
  }
  }
  .foot-menu {
    width: 100%;
    height: 46px;
    background: white;
    position: fixed;
    bottom: 0;
    margin: auto;
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
            title: '性别',
            path: ''
          },
          {
            title: '生日&星座',
            path: ''
          },
          {
            title: '兴趣',
            path: ''
          },
          {
            title: '手机',
            path: ''
          }
        ]
      }
    }
  }
</script>
