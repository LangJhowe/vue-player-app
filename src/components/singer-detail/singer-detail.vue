<template>
    <transition name="slide">
        <MusicList
        class="singer-detail"
        :songs="songs"
        :bgImage="bgImage"
        :title="title"
        ></MusicList>
    </transition>
</template>
<script>
import {getSongVkey} from 'common/js/singer'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  name: 'singerDetail', // 要给name 不给name eslint报错
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail()
  },
  methods: {
    // 有时候没有获取id，就返回singer页面
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
    // 旧
    //   let ret = []
    //   console.log('We have this one')
    //   list.forEach((item) => {
    //     let {musicData} = item.musicData
    //     if (musicData.songid && musicData.albummid) {
    //       ret.push(createSong(musicData))
    //     }
    //     console.log(ret)
    //   })

    // 新
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        getSongVkey(musicData.songmid).then((res) => {
        //   console.log('这首歌的vkey获取到了')
          const vkey = res.data.items[0].vkey
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData, vkey))
          }
        })
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
.singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
.slide-enter-active,.slide-leave-active
    transition: all .3s
.slide-enter,.slide-leave-to
    transform translate3d(100%,0,0)
</style>
