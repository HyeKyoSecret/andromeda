<template>
  <div class="comment">
    <div class="notice">
      <span class="icon">
        <img src="../../img/icon/back.png">
      </span>
      <span class="title">
        评论
      </span>
    </div>
    <div class="comment-number">
      评论（874）
    </div>
    <div class="all-comment">
      <div class="one-comment">
        <div class="critic-pic">
          <img src="../../img/photo/2b_head.png">
        </div>
        <div class="comment-content">
          <div class="critic-name">
            <span class="critic">2B</span>
            <span class="to">
              <img src="../../img/icon/gray_triangle.png">
            </span>
            <span class="re-critic">9S</span>
          </div>
          <div class="content">
            9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。9s说的对。
          </div>
          <div class="information">
            <span class="thumb-up">
              <img src="../../img/icon/gray_thumb.png">119
            </span>
            <span class="reply">回复</span>
            <span class="time">03/01</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/style.css";
  @import "../../scss/config";
  .comment {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: white;
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
    .comment-number {
      font-size: 14px;
      color: $font-gray;
      padding-left: 20px;
      height: 30px;
      background-color: $bg-gray;
      vertical-align: middle;
      line-height: 30px;
      font-weight: 800;
    }

    .all-comment {
      .one-comment {
        background-color: white;
        display: flex;
        padding: 10px 10px 10px 10px;

        .critic-pic {
          flex: 1;
          img {
            width: 50px;
            height: 50px;
          }
        }
        .comment-content {
          flex: 8;
          margin-left: 10px;
          color: $font-dark;
          border-bottom: 1px solid $line-gray;
          .critic-name {
            font-size: 16px;
            font-weight: 800;
            img {
              height: 10px;
              width: 10px;
            }
          }
          .content {
            font-size: 14px;
            color: $font-dark;
            margin-top: 5px;
          }
          .information {
            margin-top: 10px;
            margin-bottom: 10px;
            span {
              height: 14px;
              line-height: 14px;
              color: $font-gray;
              margin-right: 5px;
              img {
                margin-right: 5px;
                height: 14px;
                width: 14px;
              }
            }
          }
        }
      }
    }
    &:last-child .comment-content {
      border: none;
    }
  }
</style>
