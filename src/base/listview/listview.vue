<template>
  <scroll class="listview"
          :data="data"
          @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          ref="listview">
    <!-- 歌手列表 开始 -->
    <ul>
      <li v-for="(group, index) in data" class="list-group" ref="listGroup" :key="index">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="(item, index) in group.items" class="list-group-item" :key="index">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 歌手列表 结束 -->

    <!-- 快速入口 开始-->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
          @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList"
            class="item"
            :data-index="index"
            :class="{current:currentIndex === index}"
            :key="index">{{item}}
        </li>
      </ul>
    </div>
    <!-- 快速入口 结束 -->

    <!-- fixed 标题 开始 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <!-- fixed 标题 结束 -->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18// 锚点高度，根据style样式

export default {
  props: {
    data: {
      type: Array,
      // default: [] 旧版写法报错 必须是一个function
      default: function() {
        return []
      }
    }
  },
  computed: {
    shortcutList() {
      // map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
      // map() 方法按照原始数组元素顺序依次处理元素。
      // 注意： map() 不会对空数组进行检测。
      // 注意： map() 不会改变原始数组。
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    // 滚动歌手列表 固定在顶部的title
    fixedTitle() {
      // console.log(this.scrollY) 列表局顶部的距离
      if (this.scrollY > 0) { // 顶部往下拉
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  data() {
    return {
      scrollY: -1, // 歌手列表上端  滚动的位置
      currentIndex: 0, // 当前的歌手分类组的索引
      diff: -1// 下一歌手分类组到歌手列表上端的位置
    }
  },
  created() {
    this.probeType = 3 // 实时滚动 传3
    this.listenScroll = true
    this.touch = {}// 为什么不在data，props里创建，都会被添加getter、setter，会被观测变化
    this.listHeight = []
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]// 获取第一个触点
      this.touch.y1 = firstTouch.pageY// 页面触电Y坐标
      this.touch.anchorIndex = anchorIndex

      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta

      this._scrollTo(anchorIndex)
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 计算每一组的高度，并放在listHeight数组中
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      // index的范围
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // index的范围
      this.scrollY = -this.listHeight[index]// 点击shortcut 高亮
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)// bscroll插件暴露给scroll组件的方法，滚动到指定元素
    }
  },
  watch: { // 监测实时变化
    data() { // 上面data属性里的对象
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      //
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY // 上限值减去滚动的
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      // 当下一个歌手列表组的title上去，fixed会改变位置，像是顶上去
      // 当顶完覆盖后fixed 不满足newVal > 0 && newVal < TITLE_HEIGHT，自然变为0，又回到原状态，并且fixedTitle改变
    }
  },
  components: {
    Scroll,
    Loading
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
