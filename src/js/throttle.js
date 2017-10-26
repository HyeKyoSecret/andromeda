/**
 * Created by swallow on 2017/10/18.
 */
var debounce = function (action, delay) {
  var timer = null
  return function () {
    var args = arguments
    var self = this
    clearTimeout(timer)
    timer = setTimeout(function () {
      action.call(self, args)
    }, delay)
  }
}
//
// /*
//  * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
//  * @param fn {function}  要调用的函数
//  * @param delay   {number}    空闲时间
//  * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
//  * @return {function}实际调用函数
//  */
//
module.exports = debounce
