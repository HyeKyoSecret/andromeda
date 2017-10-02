<template>
  <div class="request-template">
    <div class="rq-content">
      <mt-cell-swipe class='rq'
                     title="HyeKyo"
                     :right="[
          {
            content: '删除',
            style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'}
          }
        ]">
        <slot>
          <div class='add-request'>
            <span>请求添加您为好友</span>
            <span>2017-12-12 18:54</span>
            <span class='pass-btn'>通过</span>
          </div>
        </slot>
      </mt-cell-swipe>
    </div>
    <div class="rq-content">
      <mt-cell-swipe class='rq'
                     title="千里不留行"
                     :right="[
          {
            content: '删除',
            style: { background: 'red', color: '#fff', width: '50px', textAlign: 'center'}
          }
        ]">
        <slot>
          <div class='add-request'>
            <span>请求添加您为好友</span>
            <span>2017-12-12 16:06</span>
            <span class='pass-btn'>通过</span>
          </div>
        </slot>
      </mt-cell-swipe>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../../scss/config";
  .request-template {
    margin-top: 25px;
    width: 100%;
    .rq-content {
      width: 100%;
      display: flex;
      align-items: center;
      &:last-child {
        border: none;
        margin-bottom: 70px;
      }
      .rq {
        width: 100%;
        height: 50px;
        background: white;
        color: $icon-blue;
        font-weight: 600;
        font-size: 14px;
        .add-request {
          line-height: 50px;
          .pass-btn {
            width: 70px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 5px;
            font-size: 14px;
            letter-spacing: 3px;
            color: #ffffff;
            background: $main-color;
            padding: 5px 9px 5px 9px;
          }
          span {
            margin-left: 5px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
<script>
  export default {
    name: 'request'
  }
</script>
