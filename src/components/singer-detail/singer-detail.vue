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
import {getSingerDetail} from 'api/singer'
import {getSongVkey} from 'api/song'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
import {promisesIter} from 'common/js/utils'
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
          let list = this.songs
          list.forEach((item) => {
            getSongVkey(item.mid).then((res) => {
              let vkey = res.data.items[0].vkey
              item.url = `http://dl.stream.qqmusic.qq.com/C400${item.mid}.m4a?vkey=${vkey}&guid=8282096940&uin=0&fromtag=66`
            })
          })
        }
      })
    },
    _normalizeSongs(list) {
      // 旧 视频上的 但可以通过上方getSingerDetai内的getSongVkey获得vkey  且不影响列表顺序
      // 其他类似请求 想disc，rank，search都用这种方法
      // let ret = []
      // console.log('We have this one')
      // list.forEach((item) => {
      //   let {musicData} = item // 等价于musicData = item.musicData
      //   if (musicData.songid && musicData.albummid) {
      //     ret.push(createSong(musicData))
      //   }
      // })
      // return ret

      // 旧 配合 promiseIter
      let ret = []
      console.log(list)
      let promises = []
      for (let i = 0; i < list.length; i++) {
        promises.push(getSongVkey(list[i].musicData.songmid))
      }
      let thenFunction = (res, index) => {
        let vkey = res.data.items[0].vkey
        let {musicData} = list[index] // 等价于musicData = item.musicData
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData, vkey))
        }
      }
      promisesIter(promises, thenFunction)
      return ret

      // 新 但问题是每次退回在进入歌手详情 每次的列表都不一样，原因是getSongKey是异步并行 每次的顺序不能确定
      // let ret = []
      // list.forEach((item) => {
      //   let {musicData} = item
      //   getSongVkey(musicData.songmid).then((res) => {
      //   //   console.log('这首歌的vkey获取到了')
      //     const vkey = res.data.items[0].vkey
      //     if (musicData.songid && musicData.albummid) {
      //       ret.push(createSong(musicData, vkey))
      //     }
      //   })
      //  })
      // for (let i = 0; i < 10; i++) {
      //   console.log(list)
      //   console.log(list[i].musicData.albumname)
      // }
      // return ret

      // 解决顺序 递归 递归方法promisesIter已经封装在common/js/utils中
      // 但是在搜索 result那栏很那处理，无法使用concat
      // let ret = []
      // let promises = []
      // for (let i = 0; i < list.length; i++) {
      //   promises.push(getSongVkey(list[i].musicData.songmid))
      // }
      // let thenFunction = (res, index) => {
      //   const vkey = res.data.items[0].vkey
      //   if (list[index].musicData.songid && list[index].musicData.albummid) {
      //     ret.push(createSong(list[index].musicData, vkey))
      //   }
      // }
      // promisesIter(promises, thenFunction)
      // return ret
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
