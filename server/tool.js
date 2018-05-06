const fs = require('fs')
const path = require('path')
exports.formImg = function (imgPath) {
  if (imgPath) {
    let macPath = imgPath.split('/andromeda/server/picture')
    let winPath = imgPath.split('\\andromeda\\server\\picture')
    if (winPath.length > 1) {
      return '\\static\\thumb' + winPath[1]
    } else if (macPath.length > 1) {
      return '/static/thumb' + macPath[1]
    } else {
      return 'default'
    }
  } else {
    return 'default'
  }
}
exports.getFileName = function (path) {
  let windowsPath = path.split('\\')
  let macPath = path.split('/')
  if (path && windowsPath.length > 1) {
    return windowsPath[windowsPath.length - 1]
  } else if (path && macPath.length > 1) {
    return macPath[macPath.length - 1]
  } else {
    return null
  }
}
exports.clearFiles = function (imgPath) {
  if (imgPath) {
    let macPath = imgPath.split('/server/picture')
    let winPath = imgPath.split('\\server\\picture')
    let staticThumb, distThumb
    if (macPath.length > 1 && fs.existsSync(imgPath)) {
      staticThumb = winPath[0] + '/static/thumb' + winPath[1]
      distThumb = winPath[0] + '/dist/static/thumb' + winPath[1]
    }
    if (winPath.length > 1 && fs.existsSync(imgPath)) {
      staticThumb = winPath[0] + '\\static\\thumb' + winPath[1]
      distThumb = winPath[0] + '\\dist\\static\\thumb' + winPath[1]
    }
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath)
    }
    if (fs.existsSync(staticThumb)) {
      fs.unlinkSync(staticThumb)
    }
    if (fs.existsSync(distThumb)) {
      fs.unlinkSync(distThumb)
    }
  }
}
