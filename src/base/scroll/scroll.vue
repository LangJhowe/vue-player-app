<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  // 可能会出现的问题 无法滚动
  // 1）渲染后 无法获得高度 需要传入 数据 变化
  // 例如 父组件传入:data='discList'
  // 问题 为什么传入discList,不可以传recommend，或者二者
  // 例如 在父组件中，给recommend延迟1s,渲染正常，但滚动歌单时
  //      无法滚动到底部，高度差刚好是一个slider高度
  // 解决 监听 slide img的渲染

  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {// 监听滚动 缓慢或快速
      type: Number,
      default: 1
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {// 能不能点击
      type: Boolean,
      default: true
    },
    listenScroll: {// 监听滚动位置 推荐列表不需要 但歌手列表需要
      type: Boolean,
      default: false
    },
    data: {// 接受数据 动态变化 refresh scroll
      type: Array,
      default: null
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    // 确保dom渲染
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }

      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }

      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    // 代理
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    // 刷新 scroll
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 歌手列表点击字母 跳转到 对应group
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  // watch data变化
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
