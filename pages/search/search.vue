<template>
  <view class="u-page">
    <musiccHeader title="网易云音乐" :icon="true"></musiccHeader>
    <view class="container">
      <scroll-view scroll-y="true" class="container-box">
        <!-- 搜索框 -->
        <view class="search-search">
          <text class="iconfont iconsearch"></text>
          <input type="text" placeholder="搜索歌曲" v-model.trim="searchWord" @confirm="serachEvent" />
          <text class="iconfont iconguanbi" v-if="searchWord" @click="searchWord = ''"></text>
        </view>
        <!-- 首屏 -->
        <block v-if="!searchWord">
          <!-- 搜索历史 -->
          <view class="search-history">
            <view class="search-history-head">
              <text>历史记录</text>
              <text class="iconfont iconlajitong" @tap="searchHistoryClear"></text>
            </view>
            <view class="search-history-list">
              <view v-for="(item, i) in searchHistory" :key="i" @tap="toSerachWord(item)">{{ item }}</view>
            </view>
          </view>
          <!-- 热门榜单 -->
          <view class="search-hot">
            <view class="search-hot-header">热搜榜</view>
            <view class="search-hot-item" v-for="(item, i) in serachHotData" :key="i" @tap="toSerachWord(item.searchWord)">
              <view class="search-hot-left">{{ i + 1 }}</view>
              <view class="search-hot-middle">
                <view>
                  <text>{{ item.searchWord }}</text>
                  <image :src="item.iconUrl" mode="aspectFit"></image>
                </view>
                <view>{{ item.content }}</view>
              </view>
              <view class="search-hot-right">
                <text>{{ item.score }}</text>
              </view>
            </view>
          </view>
        </block>
        <!-- 搜索结果 -->
        <block v-else-if="searchWord && isShowRes">
          <view class="search-result">
            <view class="search-result-item" v-for="(item, i) in searchList" @tap="goDetail(item.id)" :key="i">
              <view class="text-content">
                <view>{{ item.name }}</view>
                <view>{{ item.artists[0].name }}-{{ item.album.name }}</view>
              </view>
              <view class="icon-right"><text class="iconfont iconbofang"></text></view>
            </view>
          </view>
        </block>
        <!-- 搜索建议 -->
        <block v-else-if="searchWord">
          <view class="search-suggest">
            <view class="search-suggest-item" v-for="(item,i) in searchSuggestList" :key='i' @tap="goRes(item.keyword)">
              <view><text class="iconfont iconsearch"></text><text>{{item.keyword}}</text></view>
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import * as api from '../../common/api.js';
export default {
  data() {
    return {
      serachHotData: [], // 热搜
      searchWord: '',
      searchHistory: [],
      searchList: [],
      isShowRes: false,
      searchSuggestList:[]
    };
  },
  watch: {
    async searchWord(val) {
      if (!val) {
        this.isShowRes = false;
      }else{
        let res=await api.serachSuggest(val)
        if(res[1].data.code!==200) return uni.showToast({
          title:'数据错误'
        })
        this.searchSuggestList=res[1].data.result.allMatch
      }
    }
  },
  methods: {
    // 搜索建议跳转结果
   async goRes(word){
      this.searchWord=word
      await this.serachEvent()
    },
    // 搜索结果跳转详情页
    goDetail(id) {
      uni.navigateTo({
        url: `../detail/detail?id=${id}`
      });
    },
    // 获取搜索结果
    async getSearchList(keyword) {
      if (!keyword) return;
      let res = await api.serachRes(keyword);
      if (res[1].data.code !== 200)
        return uni.showToast({
          title: '搜索失败'
        });
      this.searchList = res[1].data.result.songs;
    },
    // 清除历史记录
    searchHistoryClear() {
      try {
        uni.removeStorageSync('searchHistory');
        this.searchHistory = [];
      } catch (e) {
        return console.log(e);
      }
    },
    // 搜索事件
    async serachEvent() {
      this.searchHistory.unshift(this.searchWord);
      this.searchHistory = [...new Set(this.searchHistory)];
      if (this.searchHistory.length > 10) {
        this.searchHistory.length = 10;
      }
      uni.setStorageSync('searchHistory', JSON.stringify(this.searchHistory));
      this.isShowRes = true;
      await this.getSearchList(this.searchWord);
    },
    // 更新serach
    toSerachWord(word) {
      this.searchWord = word;
    },
    // 获取热搜
    async serachHotEvnet() {
      let res = await api.serachHot();
      if (res[1].data.code !== 200)
        return uni.showToast({
          title: '数据加载错误'
        });
      this.serachHotData = res[1].data.data;
    }
  },
  async onLoad() {
    // 读取本地存储中的数据
    let data = JSON.parse(uni.getStorageSync('searchHistory') || '[]');
    this.searchHistory = data;
    await this.serachHotEvnet();
  }
};
</script>

<style lang="scss">
// 搜索框
.search-search {
  display: flex;
  align-items: center;
  height: 70rpx;
  margin: 70rpx 30rpx 50rpx 30rpx;
  background: #f7f7f7;
  border-radius: 50rpx;
  text {
    margin: 0 26rpx;
  }
  input {
    flex: 1;
    flex-shrink: 0;
    font-size: 26rpx;
  }
}
// <!-- 搜索历史 -->
.search-history {
  width: 100%;
  font-size: 30rpx;
  .search-history-head {
    padding: 0 50rpx;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .search-history-list {
    font-size: 26rpx;
    display: flex;
    flex-wrap: wrap;
    view {
      padding: 16rpx 28rpx;
      border-radius: 40rpx;
      margin-left: 20rpx;
      margin-top: 20rpx;
      background-color: #d0d0d0;
    }
  }
}
// 热门榜单
.search-hot {
  padding: 0 50rpx;
  box-sizing: border-box;
  width: 100%;
  font-size: 26rpx;
  .search-hot-header {
    font-size: 30rpx;
    margin: 30rpx 0;
  }
  .search-hot-item {
    display: flex;
    align-items: center;
    margin-bottom: 58rpx;
    .search-hot-left {
      color: red;
      width: 60rpx;
      margin-left: 8rpx;
    }
    .search-hot-middle {
      flex: 1;
      flex-shrink: 0;
      view:nth-of-type(1) {
        text {
          font-size: 28rpx;
          color: black;
        }
        image {
          width: 48rpx;
          height: 22rpx;
        }
      }
      view:nth-of-type(2) {
        font-size: 24rpx;
        color: #c0c0c0;
      }
    }
    .search-hot-right {
      font-size: 24rpx;
      color: #c0c0c0;
    }
  }
}
// 搜索结果
.search-result {
  border-top: 4rpx #c0c0c0 solid;
  padding: 30rpx;
  box-sizing: border-box;
  .search-result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    border-bottom: 2rpx solid #dfdfdf;
    padding-bottom: 20rpx;

    .text-content {
      view:nth-of-type(1) {
        font-size: 28rpx;
        color: #5379a7;
      }
      view:nth-of-type(2) {
        font-size: 22rpx;
        color: #999999;
      }
    }

    .icon-right {
      text {
        font-size: 50rpx;
      }
    }
  }
}
.search-suggest{
  border-top: 4rpx #c0c0c0 solid;
  padding: 30rpx;
  box-sizing: border-box;
  font-size: 26rpx;
  .search-suggest-header{
    color: #15475a;
   margin: 20rpx 20rpx 70rpx 20rpx;
  }
  .search-suggest-item{
    text{
      margin: 10rpx;
    line-height: 60rpx;
    }
  }
}
</style>
