<template>
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImage"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
    transition all .3s ease
.slide-enter, .slide-leave-to
    transform translated(100%, 0, 0)
</style>