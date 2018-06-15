import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/utils'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  // 解决↓↓↓↓↓↓↓↓
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  // 解决↑↑↑↑↑↑↑↑↑
  // 旧commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit}, {list}) {
  // 并没有出现7-18课程视频中的问题
  // 当暂停使用播放时 设置random模式 再返回singer-detail页面点// 击其他歌曲a 却并不是播放a
  // 因为我是实现复制好shuffle的完整版，经过测试，是视频问题的shuffer之前没有脱离原arr关系的原因
  // 而且当点击列表歌单
  // 但出现另一个问题
  // 随机播放全部  此事时random模式 再返回singer-detail页面点其他歌曲执行了selectPlay,playlist为顺序 当该歌曲播放完后 执行的是sequence模式，顺序播放，因此需要判断 继续传入randomList
  // 如上接头解决
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}