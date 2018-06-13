<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!--keep-alive 保存在缓存中 跳转使，不会重新请求重新渲染-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus">
@import "common/stylus/variable.styl"
#app
  color:$color-theme
</style>
