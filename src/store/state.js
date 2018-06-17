import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false, // 是否正在播放
  fullScreen: false, // 是否全屏
  playlist: [], // 播放的列表
  sequenceList: [], // 顺序列表 随机播放列表 历史列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 单签歌曲
  disc: {}
}
export default state