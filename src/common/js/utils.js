function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 洗牌函数 打乱
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function promisesIter(promises, thenFunction) {
  nextPromise(0, promises)
  function nextPromise(index, promise) {
    let length = promise.length
    if (index >= length) {
      return // out退出递归
    }
    promises[index].then((res) => {
      thenFunction(res, index)
      nextPromise(index + 1, promises)
    })
  }
}