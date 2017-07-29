import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'

//解决移动端300毫秒的延迟
fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})