/**
 * Created by swallow on 2017/10/18.
 */
let throttle = function (fn, delay, immediate, debounce) {
  let curr = +new Date() // 当前事件
  let lastCall = 0
  let lastExec = 0
  let timer = null
  let diff // 时间差
  let context // 上下文
  let args
  let exec = function () {
    lastExec = curr
    fn.apply(context, args)
  }
  return function () {
    curr = +new Date()
    context = this
    args = arguments
    diff = curr - (debounce ? lastCall : lastExec) - delay
    clearTimeout(timer)
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay)
      } else if (diff >= 0) {
        exec()
      }
    } else {
      if (diff >= 0) {
        exec()
      } else if (immediate) {
        timer = setTimeout(exec, -diff)
      }
    }
    lastCall = curr
  }
}

/*
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param fn {function}  要调用的函数
 * @param delay   {number}    空闲时间
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */

let debounce = function (fn, delay, immediate) {
  return throttle(fn, delay, immediate, true)
}

module.exports = debounce
