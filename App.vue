<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  }
};
</script>

<style lang="scss">
/*每个页面公共css */
/* 引入iconfont */
@import 'uview-ui/index.scss';
@import url('~@/common/iconfont.css');

.container {
  width: 100%;
  height: calc(100vh - 120rpx);
  overflow: hidden;
  .container-box {
    width: 100%;
    height: 100%;
  }
}
// 背景图片样式
.fixBg {
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-size: cover;
  background-position: center 0;
  transform: scale(1.2);
  z-index: -1;
}
.fixBg::after{
  content: '';
  display: block;
  width: 100%;
  height: 100vh;
  // 继承父容器背景的样式
   background: inherit;
   position: fixed;
   z-index: -99;
   filter: blur(20px);
   -webkit-filter: blur(20px) brightness(50%);
   // filter:;
}
</style>
