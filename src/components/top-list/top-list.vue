<template>
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getSongVkey} from 'api/song'
import {promisesIter} from 'common/js/utils'
export default {
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getMusicList()
  },
  data() {
    return {
      rank: true,
      songs: []
    }
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        return this.$router.push('/rank')
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.songlist)
        }
      })
    },
    _normalizeSong(list) {
      // 旧 歌曲顺序会乱
      // let ret = []
      // list.forEach((item) => {
      //   let musicData = item.data
      //   getSongVkey(musicData.songmid).then((res) => {
      //   //   console.log('这首歌的vkey获取到了')
      //     const vkey = res.data.items[0].vkey
      //     if (musicData.songid && musicData.albummid) {
      //       ret.push(createSong(musicData, vkey))
      //     }
      //   })
      // })
      // return ret
      let ret = []
      let promises = []
      for (let i = 0; i < list.length; i++) {
        promises.push(getSongVkey(list[i].data.songmid))
      }
      let thenFunction = (res, index) => {
        const vkey = res.data.items[0].vkey
        if (list[index].data.songid && list[index].data.albummid) {
          ret.push(createSong(list[index].data, vkey))
        }
      }
      promisesIter(promises, thenFunction)
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
    transition: all .3s ease

.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>