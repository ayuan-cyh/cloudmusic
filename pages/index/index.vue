<template>
  <view class="content">
    <musiccHeader title="网易云音乐" :icon="false"></musiccHeader>
    <u-search shape="round" height="60rpx" @tap="goSearch" :showAction="false" disabled placeholder="搜索歌曲"></u-search>
    <view class="container">
      <scroll-view scroll-y="true" class="container-box">

        <J-skeleton
        :loading="loading"
        :avatarSize="skeleton1.avatarSize"
        :row="skeleton1.row"
        :showTitle="skeleton1.showTitle"
        >
          <view class="index-list">
            <view class="index-item" v-for="(item, i) in dataList" :key="i" @tap="goToList(item)">
              <view class="imgBox">
                <image :src="item.coverImgUrl" mode=""></image>
                <text>{{ item.name }}</text>
              </view>
              <view class="text-container">
                <view v-for="(item1, i1) in item.tracks" :key="i1">{{ i1 + 1 }}.{{ item1.first }}-{{ item1.second }}</view>
              </view>
            </view>
          </view>
        </J-skeleton>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { topList } from '../../common/api.js';
export default {
  data() {
    return {
      title: 'Hello',
      dataList: [],
      loading:true,
      skeleton1 : {
        avatarSize: '52px',
        row: 3,
        showTitle: true,
      }
    };
  },
  async onLoad() {
    await this.loadData();
  },
  methods: {
    goSearch() {
      uni.navigateTo({
        url:'../search/search'
      })
    },
    async loadData() {
      this.dataList = await topList();
    },
    // 跳转列表页面
    goToList(item){
      uni.navigateTo({
        url:`../list/list?id=${item.id}`
      })
    },
        reloadData() {
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 3000)
        },
  },
  created() {
        this.reloadData()
  }
};
</script>

<style lang="scss" scoped>
.index-list {
  padding: 26rpx 0 0 26rpx;
  box-sizing: border-box;
  .index-item {
    display: flex;
    margin-top: 20rpx;
    .imgBox {
      position: relative;
      image {
        width: 212rpx;
        height: 212rpx;
        border-radius: 23rpx;
        overflow: hidden;
      }
      text {
        position: absolute;
        bottom: 12rpx;
        left: 12rpx;
        color: #ffffff;
        width: 100%;
        overflow: hidden;
      }
    }
    .text-container {
      padding-left: 23rpx;
      box-sizing: border-box;
      line-height: 66rpx;
      font-size: 24rpx;
      width: 80%;
      view {
        width: 80%;
        height: 66rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
