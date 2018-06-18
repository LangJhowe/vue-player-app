<template>
    <transition>
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getSongVkey} from 'api/song'
import {promisesIter} from 'common/js/utils'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      // 歌单列表不能保证顺序
      // let ret = []
      // list.forEach((item) => {
      //   let musicData = item
      //   getSongVkey(musicData.songmid).then((res) => {
      //     //   console.log('这首歌的vkey获取到了')
      //     const vkey = res.data.items[0].vkey
      //     if (musicData.songid && musicData.albumid) {
      //       ret.push(createSong(musicData, vkey))
      //     }
      //   })
      // })
      // return ret
      let ret = []
      let promises = []
      for (let i = 0; i < list.length; i++) {
        promises.push(getSongVkey(list[i].songmid))
      }
      let thenFunction = (res, index) => {
        const vkey = res.data.items[0].vkey
        if (list[index].songid && list[index].albummid) {
          ret.push(createSong(list[index], vkey))
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

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active,.slide-leave-active
    transition all 0.3s

.slide-enter,.slide-leave-to
    transform translate3d(100%,0,0)

</style>