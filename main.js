import App from './App'

// #ifndef VUE3
import uView from "uview-ui";
import Vue from 'vue'
import store from 'store/index.js'
import globalplug from 'plugins/globalpug.js'
Vue.config.productionTip = false
Vue.use(uView);
Vue.use(globalplug)
App.mpType = 'app'
const app = new Vue({
    ...App,
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif