<template>
  <view v-if="!isLoading">
    <view class="fixBg" :style="{ background: 'url(' + songDetail.al.picUrl + ')' }"></view>
    <musiccHeader :title="songDetail.name" :icon="true" color="#ffffff"></musiccHeader>
    <view class="container">
      <scroll-view scroll-y="true" class="container-box">
        <view class="detail-Play">
          <image :src="songDetail.al.picUrl" :class="{ 'detail-play-run': isPlay }" mode=""></image>
          <text class="iconfont" :class="iconClass" @tap="songPlayEvent"></text>
          <view></view>
        </view>
        <view class="detail-lyrics">
          <view class="detail-lyrics-box" :style="{ transform: `translateY(-${(lyricIndex - 1) * 82}rpx)` }">
            <view class="detail-lyrics-item" v-for="(item, i) in lyricData" :key="i" :class="{ active: i == lyricIndex - 1 }">{{ item.lyric }}</view>
          </view>
        </view>
        <view class="detail-Like">
          <view class="detail-Like-header">喜欢这首歌的人也听</view>
          <view class="detail-Like-item" v-for="(item, i) in simiSongList" :key="i" @tap="clickMusic(item.id)">
            <view class="detail-Like-img"><image :src="item.album.picUrl" mode=""></image></view>
            <view class="detail-Like-song">
              <view>{{ item.name }}</view>
              <view>
                <image v-if="item.privilege.maxbr === 999000" src="../../static/sq.png" mode=""></image>
                <image v-if="item.privilege.flag > 60 && item.privilege.flag < 70" src="../../static/dujia.png" mode=""></image>
                <text>{{ item.name }}-{{ item.album.artists[0].name }}</text>
              </view>
            </view>
            <view class="icon"><text class="iconfont iconbofang"></text></view>
          </view>
        </view>
        <view class="detail-common">
          <view class="detail-common-top">精彩评论</view>
          <view class="detail-common-item" v-for="(item, i) in songComment" :key="i">
            <view class="detail-common-img"><image :src="item.user.avatarUrl" mode=""></image></view>
            <view class="detail-common-content">
              <view class="title">
                <view class="detail-common-title">
                  <view>{{ item.user.nickname }}</view>
                  <view>{{ item.timeStr }}</view>
                </view>
                <view class="detail-common-like">
                  {{ item.likedCount }}
                  <text class="iconfont iconlike"></text>
                </view>
              </view>
              <view class="detail-common-bottom">{{ item.content }}</view>
              <view class="botton-line" style="border-bottom: 1px solid #C0C0C0; margin-top: 40rpx;"></view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import * as api from '../../common/api.js';
export default {
  data() {
    return {
      // 音乐描述
      songDetail: {
        al: {
          picUrl: ''
        }
      },
      simiSongList: [], // 相似音乐
      songComment: [], // 评论列表
      lyricData: [], //歌词
      songUrl: '',
      iconClass: 'iconpause', //控制图标
      isPlay: true, //控制是否旋转
      lyricIndex: 0, // 歌词下标
      isLoading: true // 控制加载
    };
  },
  methods: {
    // 切换音乐的事件
    async clickMusic(id) {
      await this.getMusicAllInfo(id);
    },
    // 监听歌词对应下标的事件用于滚动歌词
    listenLyricIndex() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        for (let i = 0; i < this.lyricData.length; i++) {
          if (this.bgAudioManager.currentTime > this.lyricData[this.lyricData.length - 1].time) {
            this.lyricIndex = this.lyricData.length - 1;
            break;
          }
          // 如果当前时间大于第一句歌词时间小于第二句歌词时间保存对应下标
          if (this.bgAudioManager.currentTime > this.lyricData[i].time && this.bgAudioManager.currentTime < this.lyricData[i + 1].time) {
            this.lyricIndex = i + 1;
          }
        }
      }, 550);
    },
    // 改变歌曲播放状态的事件
    songPlayEvent() {
      if (this.bgAudioManager.paused) {
        this.bgAudioManager.play();
      } else {
        this.bgAudioManager.pause();
      }
    },
    // 获取歌曲链接和播放歌曲
    async getSongUrl(id) {
      let res = await api.songUrl(id);
      if (res[1].data.code !== 200)
        return uni.showToast({
          title: '数据请求失败'
        });
      this.songUrl = res[1].data.data[0].url;
      this.listenLyricIndex();
      // #ifdef MP-WEIXIN
      this.bgAudioManager = uni.getBackgroundAudioManager();
      this.bgAudioManager.title = this.songDetail.name;
      // #endif
      // #ifdef H5
      if (!this.bgAudioManager) {
        this.bgAudioManager = uni.createInnerAudioContext();
      }
      this.iconClass = 'iconbofang1';
      this.isPlay = false;
      // #endif
      this.bgAudioManager.src = this.songUrl;
      this.bgAudioManager.play();
      // 音乐开始播放的回调函数
      this.bgAudioManager.onPlay(() => {
        this.listenLyricIndex();
        this.iconClass = 'iconpause';
        this.isPlay = true;
      });
      // 音乐停止的回调函数
      this.bgAudioManager.onPause(() => {
        clearInterval(this.timer);
        this.iconClass = 'iconbofang';
        this.isPlay = false;
      });
      // 音乐结束的回调函数
      this.bgAudioManager.onEnded(() => {
        this.isLoading=true
        if (!this.$store.state.nextId) {
        }
        this.getMusicAllInfo(this.$store.state.nextId);
      });
    },
    // 格式化时间
    formatTimeToSec(value) {
      let arr = value.split(':');
      return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1);
    },
    // 获取歌词
    async getLyric(id) {
      let res = await api.songLyric(id);
      if (res[1].data.code !== 200)
        return uni.showToast({
          title: '歌词获取失败'
        });
      let data = res[1].data.lrc.lyric;
      let re = /\[([^\]]+)\]([^\[]+)/g;
      let result = [];
      data.replace(re, ($0, $1, $2) => {
        result.push({ time: this.formatTimeToSec($1), lyric: $2 });
      });
      this.lyricData = result;
    },
    // 获取评论
    async getComment(id) {
      let res = await api.songComment(id);
      if (res[1].data.code !== 200)
        return uni.showToast({
          title: '发生错误'
        });
      this.songComment = res[1].data.hotComments;
    },
    // 获取相似音乐
    async getSimiSong(id) {
      let res = await api.simiSong(id);
      if (res[1].data.code !== 200)
        return uni.showToast({
          title: '数据请求失败'
        });
      this.simiSongList = res[1].data.songs;
    },
    // 获取音乐信息
    async getMusic(id) {
      let res = await api.songDetail(id);
      this.songDetail = res[1].data.songs[0];
    },
    // 播放音乐总事件
    async getMusicAllInfo(id) {
      this.$store.commit('GET_NEXT', id);
      uni.showLoading({
        title: '加载歌曲'
      });
      await this.getMusic(id);
      await this.getSimiSong(id);
      await this.getComment(id);
      await this.getLyric(id);
      await this.getSongUrl(id);
      this.isLoading = false;
      uni.hideLoading();
    }
  },
  async onLoad(option) {
    await this.getMusicAllInfo(option.id);
  },
  onHide() {
    // #ifdef H5
    this.bgAudioManager.destroy();
    // #endif
    // #ifdef MP-WEIXIN
    clearInterval(this.timer);
    // #endif
  },
  onUnload() {
    this.bgAudioManager.destroy();
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
@keyframes move {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
// 顶部播放区域样式
.detail-Play {
  width: 580rpx;
  height: 580rpx;
  background-image: url(../../static/disc.png);
  background-position: center;
  background-size: cover;
  position: relative;
  margin: 214rpx auto 0;
  image {
    width: 370rpx;
    height: 370rpx;
    border-radius: 50%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    animation: 10s linear move infinite;
    animation-play-state: paused;
  }
  .detail-play-run {
    animation-play-state: running;
  }
  text {
    width: 100rpx;
    height: 100rpx;
    color: #ffffff;
    font-size: 100rpx;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  view {
    width: 230rpx;
    height: 360rpx;
    background-image: url(../../static/needle.png);
    position: absolute;
    background-size: cover;
    top: -175rpx;
    right: 80rpx;
  }
}
// 歌词区域样式
.detail-lyrics {
  font-size: 32rpx;
  line-height: 82rpx;
  height: 246rpx;
  text-align: center;
  color: #919193;
  overflow: hidden;
  .detail-lyrics-box {
    transition: 0.5s all;
    .detail-lyrics-item {
      height: 82rpx;
    }
    .detail-lyrics-item.active {
      color: #ffffff;
    }
  }
}
// 喜欢这首歌的人也听
.detail-Like {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  .detail-Like-header {
    font-size: 36rpx;
    color: #ffffff;
    margin: 50rpx 0;
  }
  .detail-Like-item {
    width: 100%;
    display: flex;

    .detail-Like-img {
      image {
        width: 82rpx;
        height: 82rpx;
        border-radius: 10rpx;
      }
      margin-right: 20rpx;
    }
    .detail-Like-song {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 65vw;
      view:nth-of-type(1) {
        color: #ffffff;
        font-size: 30rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      view:nth-of-type(2) {
        font-size: 24rpx;
        color: #e8e8e8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        image {
          width: 32rpx;
          flex-shrink: 0;
          height: 20rpx;
          margin-right: 5rpx;
        }
      }
    }
    .icon {
      text {
        font-size: 48rpx;
        color: #c0c0c0;
      }
    }
  }
}
// 精彩评论区域样式
.detail-common {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  .detail-common-top {
    font-size: 36rpx;
    color: #ffffff;
    margin: 50rpx 0;
  }
  .detail-common-item {
    width: 100%;
    height: 230rpx;
    overflow: hidden;
    display: flex;
    .detail-common-img {
      margin-right: 18rpx;
      image {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .detail-common-content {
      width: 100%;
      .title {
        display: flex;
        justify-content: space-between;
        .detail-common-title {
          width: 65vw;
          view:nth-of-type(1) {
            color: #e3e3e3;
          }
          view:nth-of-type(2) {
            color: #cbcbcb;
            font-size: 24rpx;
          }
        }
      }
      .detail-common-like {
        color: #cfcfcf;
        font-size: 26rpx;
      }
    }
    .detail-common-bottom {
      margin-top: 20rpx;
      font-size: 26rpx;
      color: #f8f8f8;
      width: 100%;
      max-height: 90rpx;
      line-height: 30rpx;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
