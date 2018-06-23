import Vue from 'vue'
import Router from 'vue-router'
import { resolve } from 'url'

Vue.use(Router)

const Recommend = (res) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Rank = (res) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Search = (res) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Singer = (res) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (res) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Disc = (res) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const TopList = (res) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const UserCenter = (res) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: TopList
      }]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
