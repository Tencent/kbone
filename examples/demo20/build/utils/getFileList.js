const fs = require('fs')
const path = require('path')

function getFileList (dir) {
  const _getFileList = (root, dir) => {
    const result = []
    const list = fs.readdirSync(dir)
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      const filePath = root + file
      result.push(filePath)
      if (stat.isDirectory()) {
        result.push(..._getFileList(filePath + '/', fullPath))
      }
    })
    return result
  }
  return _getFileList('', dir)
}

module.exports = getFileList
