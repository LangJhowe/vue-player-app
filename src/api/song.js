import {commonParams} from './config'
import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getLyric (mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    g_tk: 2009705742,
    pcachetime: +new Date(), // 这里是一段时间戳
    hostUin: 0,
    format: 'json', // 因为是请求本地的接口，所以format是json
    platform: 'yqq',
    needNewCode: 0,
    songmid: mid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongVkey (songmid) { // 获取歌曲的vkey
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, {
    callback: 'musicJsonCallback',
    loginUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    guid: 8282096940,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })
  return jsonp(url, data)
}