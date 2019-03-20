<template>
  <div class="me">
    <notice v-bind:title="title"></notice>
    <!--进度条-->
    <mt-progress :value="percent" :bar-height="6" v-if="percentShow">
      <!--<div slot="end">{{Math.ceil(percent)}}%</div>-->
    </mt-progress>
    <!--头像裁剪遮罩-->
    <div class="container" v-show="panel">
      <div>
        <img id="image" class="img-item" :src="url" alt="Picture">
      </div>
      <button type="button" class="button confirm" @click="crop">确定</button>
      <button type="button" class="button cancel" @click="cancelCrop">取消</button>
    </div>
    <div>
      <!--<div class="show">-->
        <!--<div class="picture" :style="'backgroundImage:url('+headerImage+')'">-->
        <!--</div>-->
      <!--</div>-->
      <label id="input">
        <input type="file" ref="input" id="change" accept="image" @change="change">
      </label>
    </div>
    <div class="me-content">
      <div class="user-main" v-if="isLogin">
        <div class="head-img">
          <img :src="imgSrc" alt="" @click="simulateClick" @error="setErrorImg">
        </div>
        <div class="words" @click="goChangeInfo(userId)">
          <div class="name">{{nickName}}</div>
          <div v-if="isLoginCustomer" class="f-btn">
            <div class="focus-btn" @click.stop="addFocus" v-if="!focusCond">
              + 关注
            </div>
            <div class="cancel-focus-btn" v-else @click.stop="cancelFocus">
              取消关注
            </div>
          </div>
          <div class="sign">
            {{sign}}
          </div>
          <div class="info">
            <img src="../../img/icon/zan.png">
            <div>{{follower}}</div>
          </div>
        </div>
        <div class="icon" @click="goChangeInfo(userId)">
          <img src="../../img/icon/right.png">
        </div>
      </div>
      <router-link to="/login" tag="div" class="fake-user-main" v-else>
        <img src="../../img/images/logo.png" alt="">
        <p>登录仙女座，链接你与Ta们的故事</p>
      </router-link>
        <div class="user-operation">
          <router-link :to='item.path' tag='div' class="line" v-for='item in operation' :key="item.name">
            <div class="left">
              <img :src='item.icon'>
            </div>
            <div class="right">
              <div class="words">
                <span class="sex" v-if="operation.length === 5 && item.name !== '共同好友'">{{sex}}</span>
                <span class="name">{{item.name}}</span>
                <span class="note"></span>
              </div>
              <div class="icon">
                <img src="../../img/icon/right.png">
              </div>
            </div>
          </router-link>
        </div>
        <div v-if="isLoginCustomer">
          <div class="add-friend" @click="addFriend" v-if="!friendCond">
            添加好友
          </div>
          <div class="delete-friend" @click="deleteFriend" v-if="friendCond">
            删除好友
          </div>
        </div>
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <foot-menu v-if="!isLoginCustomer"></foot-menu>
  </div>
</template>
<style lang='scss' scoped>
  @import "../../scss/config";
  @import "../../scss/style.css";
  @import "../../scss/cropper.css";
  .me {
    min-height: 100%;
    background: $bg-gray;
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
          padding: 0 15px 0 15px;
          .name {
            display: inline-block;
            margin-top: 8px;
            font-size: 15px;
          }
          .f-btn {
            display: inline-block;
            .focus-btn, .cancel-focus-btn {
              display: inline-block;
              margin-left: 10px;
              color: $main-color;
              border: 1px solid $main-color;
              padding: 2px 7px 2px 7px;
              border-radius: 5px;
            }
          }
          .sign {
            margin-top: 6px;
            font-size: 13px;
            min-height: 30px;
            color: $w-gray;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            -moz-box-orient: vertical;
            -moz-line-clamp: 2;
            overflow: hidden;
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
      .fake-user-main {
        height: 95px;
        width: 100%;
        background: white;
        display: flex;
        align-items: center;
        padding: 11px 0 11px 0;
        flex-wrap: nowrap;
        flex-direction: column;
        img {
          display: block;
          width: 60px;
        }
        p {
          margin-top: 10px;
          font-size: 16px;
        }
      }
      .user-operation {
        margin-top: 25px;
        padding-bottom: 100px;
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
              font-size: 0;
              span {
                font-size: 14px;
              }
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
          .add-friend {
            height: 42px;
            line-height: 42px;
            border-radius: 8px;
            background: $main-color;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            width: 85%;
            margin: 30px auto 0 auto;
          }
          .delete-friend {
            height: 42px;
            line-height: 42px;
            border-radius: 8px;
            background: $main-red;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            width: 85%;
            margin: 30px auto 0 auto;
          }
        }
      }
      .add-friend {
        height: 42px;
        line-height: 42px;
        border-radius: 8px;
        background: $main-color;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        width: 85%;
        margin: 30px auto 0 auto;
      }
      .delete-friend {
        height: 42px;
        line-height: 42px;
        border-radius: 8px;
        background: $main-red;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        width: 85%;
        margin: 30px auto 0 auto;
      }
    }
  }
</style>
<script>
  import FootMenu from '../../components/foot-menu.vue'
  import notice from '../../components/notice/notice.vue'
  import { Toast, Indicator, MessageBox } from 'mint-ui'
  import lrz from 'lrz'
  import Axios from 'axios'
  import Cropper from 'cropperjs'
  export default {
    components: {
      FootMenu,
      notice
    },
    data () {
      return {
        picValue: '',
        cropper: '',
        croppable: false,
        panel: false,
        url: '',  // 以上为头像输入所需数据
        imgSrc: '',    // 头像
        headImg: '',
        operation: [
          {
            name: '我的消息',
            icon: require('../../img/icon/my_message.png'),
            path: '/people/message/words'
          },
          {
            name: '我的创作',
            icon: require('../../img/icon/my_creation.png'),
            path: `/people/creation`
          },
          {
            name: '我的订阅',
            icon: require('../../img/icon/my_subscription.png'),
            path: '/people/subscribe'
          },
          {
            name: '我的关注',
            icon: require('../../img/icon/my_focus.png'),
            path: '/people/focusList'
          },
          {
            name: '我的好友',
            icon: require('../../img/icon/my_friend.png'),
            path: '/people/friendList'
          },
          {
            name: '我的轨迹',
            icon: require('../../img/icon/my_trail.png'),
            path: '/people/history'
          }
        ],
        cOperation: [
          {
            name: '的创作',
            icon: require('../../img/icon/my_creation.png'),
            path: `/people/creation`
          },
          {
            name: '的关注',
            icon: require('../../img/icon/my_focus.png'),
            path: '/people/focusList'
          },
          {
            name: '共同好友',
            icon: require('../../img/icon/my_friend.png'),
            path: '/people/message/words'
          }
        ],
        sex: '',
        tempOperation: [],
        userStatus: '',
        userId: '',
        nickName: '',
        friendCond: false,
        focusCond: false,
        sign: '',
        fpath: '',
        fileName: '', // 文件名
        fileExt: '',  // 文件后缀名
        percentShow: false,
        percent: 0,
        follower: null
      }
    },
    watch: {
      $route: function () {
        this.checkUser()  // 重新获取信息，防止组件复用造成的数据不刷新
      }
    },
    computed: {
      isLogin: function () {
        return this.userStatus !== 'askLogin'
      },
      isLoginCustomer: function () {
        return this.isLogin && this.userStatus === 'isCustomer'
      },
      title: function () {
        if (this.userStatus === 'isUser') {
          return '我'
        } else if (this.isLogin && this.userStatus === 'isCustomer') {
          return this.sex
        } else {
          return '我'
        }
      }
    },
    mounted () {
      // 初始化这个裁剪框
      let self = this
      let image = document.getElementById('image')
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        zoomable: false,
        ready: function () {
          self.croppable = true
        }
      })
    },
    created: function () {
      this.checkUser()
    },
    methods: {
      simulateClick () {
        if (this.userStatus === 'isUser') {
          this.$refs.input.click()
        }
      },
      setErrorImg () {
        this.imgSrc = require('../../img/images/defaultHeadImg.png')
      },
      getObjectURL (file) {
        let url = null
        if (window.createObjectURL !== undefined) { //  basic
          url = window.createObjectURL(file)
        } else if (window.URL !== undefined) { //  mozilla(firefox)
          url = window.URL.createObjectURL(file)
        } else if (window.webkitURL !== undefined) { //  webkit or chrome
          url = window.webkitURL.createObjectURL(file)
        }
        return url
      },
      change (e) {
        let files = e.target.files || e.dataTransfer.files
        this.fileName = files[0].name
        this.fileExt = files[0].name.split('.')[1]
        if (!files.length) return
        this.panel = true
        this.picValue = files[0]
        let self = this
        // 每次替换图片要重新得到新的url
        lrz(this.picValue, {width: 900, quality: 0.75}) // 压缩图片
          .then(function (rst) {
            self.url = rst.base64
            // 每次替换图片要重新得到新的url
            if (self.cropper) {
              self.cropper.replace(self.url)
            }
            self.panel = true
          })
      },
      changeToFile (dataurl) {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type: mime})
      },
      crop () {
        this.panel = false
        let croppedCanvas
        // var roundedCanvas
        if (!this.croppable) {
          return
        }
        //  Crop
        croppedCanvas = this.cropper.getCroppedCanvas()
        this.headerImage = croppedCanvas.toDataURL()
        this.postImg()
      },
      cancelCrop () {
        this.panel = false
      },
      postImg () {
        this.percentShow = true
        let file = this.changeToFile(this.headerImage)
        let self = this
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 20000, // 最大上传时间
          onUploadProgress: function (progressEvent) {
            self.$nextTick(() => {
              self.percent = (progressEvent.loaded / progressEvent.total) * 100
            })
          }
        }
        let formData = new FormData()
        formData.append('file', file, this.fileName)
        formData.append('id', this.userId)
        Indicator.open('头像上传中...')
        Axios.post('/user/uploadHeadImg', formData, config).then(response => {
          Indicator.close()
          this.percentShow = false
          this.percent = 0
          Toast({
            message: response.data.message,
            position: 'middle',
            duration: 1000
          })
          this.checkUser()
        }).catch(error => {
          Indicator.close()
          if (error) {
            Toast({
              message: '请求超时，请检查网络环境',
              position: 'middle',
              duration: 1000
            })
            this.percentShow = false
            this.percent = 0
          }
        })
      },
      checkUser () {
        if (typeof this.$route.params.user === 'undefined') {
          Axios.get('/register/checkLogin')
            .then((response) => {
              if (response.data.login) {
                if (this.operation.length < 6) {
                  this.tempOperation = this.operation     // 修改按钮
                  this.operation = this.cOperation
                  this.cOperation = this.tempOperation
                }
                this.sex = ''   // 置空sex
                this.nickName = response.data.nickName
                this.sign = response.data.sign || '这个人很懒，什么也没留下'
                this.imgSrc = response.data.headImg
                this.userId = response.data.user
                this.follower = response.data.follower
                this.userStatus = 'isUser'
                let reg = /^([0-9]){7}$/
                for (let i = 0; i < this.operation.length; i++) { // 修改path
                  let splitPath = this.operation[i].path.split('/')
                  if (!reg.test(splitPath[2])) {
                    let pathArray = this.operation[i].path.split('/people')
                    this.operation[i].path = `/people/${response.data.user}${pathArray[1]}`
                  }
                }
              } else {
                this.userStatus = 'askLogin'
              }
            }).catch(error => {
              if (error) {
                Toast({
                  message: '发生错误',
                  position: 'middle',
                  duration: 1000
                })
              }
            })
        } else {
          Axios.get('/register/checkUser', {
            params: {
              user: this.$route.params.user
            }
          }).then(res => {
            if (res.data.user) {
              if (this.operation.length < 6) {
                this.tempOperation = this.operation     // 修改按钮
                this.operation = this.cOperation
                this.cOperation = this.tempOperation
              }
              this.sex = ''   // 置空sex
              this.nickName = res.data.user.nickName
              this.sign = res.data.user.sign || '这个人很懒，什么也没留下'
              this.userId = res.data.user.userId
              this.imgSrc = res.data.user.headImg
              this.follower = res.data.user.follower
              let reg = /^([0-9]){7}$/
              for (let i = 0; i < this.operation.length; i++) { // 修改path
                let splitPath = this.operation[i].path.split('/')
                if (!reg.test(splitPath[2])) {
                  let pathArray = this.operation[i].path.split('/people')
                  this.operation[i].path = `/people/${res.data.user.user}${pathArray[1]}`
                }
              }
              if (res.data.customer) {
                if (this.operation.length > 5) {
                  this.tempOperation = this.operation     // 修改按钮
                  this.operation = this.cOperation
                  this.cOperation = this.tempOperation
                }
                this.sex = res.data.sex   // 设置性别
                this.userStatus = 'isCustomer'
                for (let i = 0; i < this.operation.length; i++) { // 修改path
                  let splitPath = this.operation[i].path.split('/')
                  if (!reg.test(splitPath[2])) {
                    let pathArray = this.operation[i].path.split('/people')
                    this.operation[i].path = `/people/${this.$route.params.user}${pathArray[1]}`
                    if (i !== 2) { // 共同好友是第三个
                      this.operation[i].name = `${this.sex}${this.operation[i].name}`
                    }
                  }
                }
                this.getFriendshipAndFocus()
              } else {
                this.userStatus = 'isUser'
              }
              this.userId = res.data.user.user
            } else {
              this.$emit('error')
            }
          }).catch(error => {
            if (error) {
              this.$emit('error')
            }
          })
        }
      },
      goChangeInfo (user) {
        this.$router.push(`/people/${user}/changeInfo`)
      },
      addFriend () {
        Axios.post('/user/addFriendRequest', {
          id: this.$route.params.user
        }).then(response => {
          if (response.data.error) {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      deleteFriend () {
        MessageBox.confirm('确定执行此操作?').then(action => {
          Axios.post('/user/deleteFriendRequest', {
            id: this.$route.params.user
          }).then(response => {
            if (response.data.error) {
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            } else {
              this.getFriendshipAndFocus()
              Toast({
                message: response.data.message,
                position: 'middle',
                duration: 1000
              })
            }
          })
        }).catch(cancel => {
          return 0
        })
      },
      getFriendshipAndFocus () {
        Axios.get('/user/getUserFriendshipAndFocus', {  // 查询好友关系（按钮显示）和关注关系
          params: {
            user: this.$route.params.user
          }
        }).then(response => {
          if (!response.data.error) {
            this.friendCond = response.data.friendCond
            this.focusCond = response.data.focusCond
          }
        })
      },
      addFocus () {
        Axios.post('/user/addFocus', {
          userId: this.$route.params.user
        }).then(response => {
          if (!response.data.error) {
            this.getFriendshipAndFocus()
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      },
      cancelFocus () {
        Axios.post('/user/cancelFocus', {
          userId: this.$route.params.user
        }).then(response => {
          if (!response.data.error) {
            this.getFriendshipAndFocus()
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          } else {
            Toast({
              message: response.data.message,
              position: 'middle',
              duration: 1000
            })
          }
        })
      }
    }
  }
</script>
