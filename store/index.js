import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    topListIds: [],
    nextId: ""
  },
  mutations: {
    // 获取歌曲的全部id列表
    GET_IDS(state, opt) {
      state.topListIds = opt
    },
    // 获取下一首音乐
    GET_NEXT(state, opt) {
      state.topListIds.forEach((item, i) => {
        if (item.id == opt) {
          // 如果存在播放下一首
          if (state.topListIds[i + 1]) {
            state.nextId = state.topListIds[i + 1].id
          }else{
            let index=Math.floor(state.topListIds.length * Math.random())
            state.nextId = state.topListIds[index].id
          }
        }
      })
    }
  }
})
