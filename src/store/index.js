import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'
// createLogger 每次通过mutation修改state通过log控制台打印log，看到日志，方便查看

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
// npm run dev是dev环境,线上调试degbug为true
// npm run build 是 production环境,线上调试degbug为false
// 当debug为true开启严格模式
// 当为false，上线时这个模式关闭
// debug会有性能损失，所以不建议线上使用
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,

  plugins: debug ? [createLogger()] : []
})