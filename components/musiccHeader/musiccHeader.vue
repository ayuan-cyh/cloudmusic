<template>
  <view class="music-head" >
    <view class="music-head-icon" v-if="icon">
      <text class="iconfont iconzuojiantou-copy" @tap="backEvent"></text>
      <text class="iconfont iconshouye" @tap="backHome"></text>
    </view>
    <text class="title" :style="{color:color}">{{title}}</text>
  </view>
</template>

<script>
  export default {
    name:"musiccHeader",
    data() {
      return {
        
      };
    },
    props:['title','icon','color'],
    methods:{
      // 返回事件
      backEvent(){
        uni.navigateBack()
      },
      // 返回到首页
      backHome(){
        uni.navigateTo({
          url:'../../pages/index/index'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.music-head{
  width: 100%;
  height: 130rpx;
  position: relative;
  text-align: center;
  .music-head-icon{
    position: absolute;
    padding-top: 15rpx;
    color: #ffffff;
    box-sizing: border-box;
    top: 50rpx;
    width: 180rpx;
    height: 60rpx;
    display: flex;
    border-radius: 30rpx;
    background-color: rgba($color: #000000, $alpha: .4);
    justify-content: space-around;
  }
  .title{
    color: black;
    line-height: 150rpx;
    text-align: center;
  }
}
</style>
