import {commonParams} from './config'
import axios from 'axios'

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