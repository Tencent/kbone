const getFileList = require('./getFileList')
const REG = /(.*)\/main\.jsx?$/

module.exports = (dirPath) => {
  const list = getFileList(dirPath)
  const filterList = list.filter(item => REG.exec(item))
  return filterList.map(item => ({
    name: item.match(REG)[1],
    path: item
  }))
}
