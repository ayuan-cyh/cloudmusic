import {baseUrl} from './config.js'
// 获取排行榜分类
export function topList(){
  return new Promise((resolve,reject)=>{
    uni.request({
      url: `${baseUrl}toplist/detail `,
      method: 'GET',
      data: {},
      success: res => {
        let data=res.data.list
        data.length=4
        resolve(data)
      },
      fail: () => {},
      complete: () => {}
    });
  })
}
// 获取排行榜对应音乐列表
export function musicList(listid){
   return uni.request({
     url: `${baseUrl}playlist/detail?id=${listid}`,
     method: 'GET'
   });
}
// 获取歌单详情
export function songDetail(id){
  return uni.request({
    url:`${baseUrl}song/detail?ids=${id}`,
    method:'GET'
  })
}
// 获取相似音乐
export function simiSong(id){
  return uni.request({
    url:`${baseUrl}simi/song?id=${id}`,
     method:'GET'
  })
}
// 歌曲评论
export function songComment(id){
  return uni.request({
    url:`${baseUrl}comment/music?id=${id}`,
     method:'GET'
  })
}
// 获取歌词
export function songLyric(id){
  return uni.request({
    url:`${baseUrl}lyric?id=${id}`,
     method:'GET'
  })
}
// 获取音乐 url
export function songUrl(id){
  return uni.request({
    url:`${baseUrl}song/url?id=${id}`,
     method:'GET'
  })
}
// 热搜列表(详细)
export function serachHot(){
  return uni.request({
   url:`${baseUrl}search/hot/detail`,
    method:'GET'
  })
}
// 搜索结果
export function serachRes(word){
  return uni.request({
    url:`${baseUrl}search?keywords=${word}`,
     method:'GET'
  })
}
// 搜索建议
export function serachSuggest(word){
  return uni.request({
    url:`${baseUrl}search/suggest?keywords=${word}&type=mobile`,
     method:'GET'
  })
}

