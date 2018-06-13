// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import axios from 'axios/index'
import VueLazyLoad from 'vue-lazyload'
Vue.prototype.$http = axios
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})
fastclick.attach(document.body)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
