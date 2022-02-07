<template>
  <view v-if="!loading">
  <view class="fixBg"
    :style="{background:'url('+ListData.coverImgUrl+')'}"
    ></view>
    <musiccHeader title="歌单" :icon="true" color="#ffffff"></musiccHeader>
    <view class="container">
      <scroll-view scroll-y="true" class="container-box">
        <view class="list-hearder">
          <view class="list-hearder-imgBox">
            <image :src="ListData.coverImgUrl" mode=""></image>
            <text class="iconfont iconyousanjiao" style="color: #FFFFFF;">{{fromatData(ListData.playCount)}}</text>
          </view>
          <view class="list-text-container">
            <view>{{ListData.name}}</view>
            <view>
              <image :src="ListData.creator.avatarUrl" mode=""></image>
              <text>网易云音乐</text>
            </view>
            <view>{{ListData.description}}</view>
          </view>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <button class="share-list" open-type="share">
          <text class="iconfont iconicon-"></text>
          分享给好友
        </button>
        <!-- #endif -->
        <view class="music-list" style="z-index: 999; position: relative;">
          <view class="music-list-top">
            <text class="iconfont iconbofang1" style="font-size: 48rpx;"></text>
            <text>播放全部</text>
            <text style="color: #C8C7CC;">(共{{ListData.trackCount}}首)</text>
          </view>
          <view class="music-list-item" 
          v-for="(item,i) in ListData.tracks"
           :key='i'
           @click="goDetail(item)"
           >
            <view class="item-left">{{i+1}}</view>
            <view class="item-middle">
              <view class="top">{{item.name}}</view>
              <view class="bottom">
               <image src="../../static/dujia.png" mode=""
               v-if="privileges[i].flag>=60 && privileges[i].flaa<70"
               ></image>
               <image src="../../static/sq.png" mode=""
               v-if="privileges[i].maxbr===999000"
               ></image>
                <text>{{item.name}}-{{item.ar[0].name}}</text>
                </view>
            </view>
            <view class="item-right">
              <text class="iconfont iconbofang1"></text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import {musicList} from '../../common/api.js'
export default {
  data() {
    return {
      ListData:{
        creator:{
          backgroundUrl:"" 
        }
      },
      privileges:[],
      loading:true
    };
  },
async  onLoad(option) {
    // 获取音乐
    await this.getListData(option.id)
  },
  methods:{
    // 跳转到detail页面
    goDetail(item){
      uni.navigateTo({
        url:`../detail/detail?id=${item.id}`
      })
    },
    // 获取音乐列表的方法
    async getListData(id){
      uni.showLoading({
        title:'数据加载中'
      })
      let res=await musicList(id)
      let {data}=res[1]
      // 存储id列表
      this.$store.commit('GET_IDS',data.playlist.trackIds)
      if(data.code!==200){
        uni.showToast({
          title:"数据请求失败"
        })
        uni.hideLoading()
      }else{
         this.ListData=data.playlist
         this.privileges=data.privileges
         this.loading=false
         uni.hideLoading()
      }
    }
  }
};
</script>

<style lang="scss">
  // 头部样式
.list-hearder {
  width: 95%;
  justify-content: space-around;
  display: flex;
  height: 300rpx;
  margin: 0 auto;
  overflow: hidden;
  .list-hearder-imgBox {
    width: 264rpx;
    height: 264rpx;
    position: relative;
    image {
      width: 100%;
      height: 100%;
      border-radius: 30rpx;
    }
    text {
      position: absolute;
      bottom: 15rpx;
      left: 15rpx;
    }
  }

  .list-text-container {
    flex: 1;
    margin-left: 20rpx;
    view:nth-of-type(1) {
      color: #ffffff;
      font-size: 35rpx;
      width: 100%;
      height: 70rpx;
      overflow: hidden;
    }
    view:nth-of-type(2) {
      display: flex;
      color: #f3f3f3;
      font-size: 28rpx;
      align-items: center;
      image {
        width: 54rpx;
        height: 54rpx;
        border-radius: 50%;
        margin-right: 14rpx;
        box-sizing: border-box;
      }
    }
    view:nth-of-type(3) {
      width: 100%;
      height: 60rpx;
      line-height: 30rpx;
      color: #dfdee2;
      font-size: 24rpx;
      margin-top: 20rpx;
      padding-left: 15rpx;
      box-sizing: border-box;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.share-list {
  width: 300rpx;
  height: 72rpx;
  background-color: rgba($color: #000000, $alpha: 0.4);
  margin: 0 auto;
  line-height: 72rpx;
  display: flex;
  justify-content: space-between;
  border-radius: 32rpx;
  color: #ffffff;
}
// 列表样式
.music-list {
  border-radius:25px 25px 0 0;
  background-color: #ffffff;
  padding: 20rpx 40rpx;
  box-sizing: border-box;
  width: 100%;
  margin-top: 40rpx;
  .music-list-top {
    padding-bottom: 40rpx;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    text{
      margin-left: 20rpx;
    }
  }
  .music-list-item{
    display: flex;
    margin-top: 20rpx;
    width: 100%;
    .item-left{
      width: 100rpx;
      
    }
    .item-middle{
      display: flex;
      width: 80vw;
      flex-direction: column;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      .top{
        width: 90%;
        font-size: 32rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .bottom{
        font-size: 24rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        align-items: center;
        image{
          width: 32rpx;
          flex-shrink: 0;
          height: 20rpx;
          margin-right: 5rpx;
        }
      }
    }
    .item-right{
      text{
        font-size: 50rpx;
      }
    }
    
    
  }
}
</style>
