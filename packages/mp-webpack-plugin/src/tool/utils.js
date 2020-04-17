const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

/**
 * 深合并对象
 */
function merge(to, from) {
    if (typeof to !== 'object' || typeof from !== 'object') return to

    const fromKeys = Object.keys(from)
    for (const key of fromKeys) {
        const fromValue = from[key]
        const fromType = typeof fromValue
        const isFromArray = +Array.isArray(fromValue)
        const toValue = to[key]
        const toType = typeof toValue
        const isToArray = +Array.isArray(toValue)

        // eslint-disable-next-line no-bitwise
        if (fromType !== toType || (isFromArray ^ isToArray)) {
            // 不同类型
            to[key] = fromValue
        } else {
            // 相同类型
            // eslint-disable-next-line no-lonely-if
            if (isFromArray) {
                fromValue.forEach(item => toValue.push(item))
            } else if (fromType === 'object') {
                to[key] = merge(toValue, fromValue)
            } else {
                to[key] = fromValue
            }
        }
    }

    return to
}

/**
 * 判断数组包含关系
 */
function includes(parentArr, childArr) {
    for (const child of childArr) {
        if (parentArr.indexOf(child) === -1) return false
    }

    return true
}

/**
 * 判断文件是否存在
 */
function isFileExisted(filePath) {
    try {
        fs.accessSync(filePath)
        return true
    } catch (err) {
        return false
    }
}

/**
 * 递归创建目录
 */
function recursiveMkdir(dirPath) {
    const prevDirPath = path.dirname(dirPath)
    try {
        fs.accessSync(prevDirPath)
    } catch (err) {
        // 上一级目录不存在
        recursiveMkdir(prevDirPath)
    }

    try {
        fs.accessSync(dirPath)

        const stat = fs.statSync(dirPath)
        if (stat && !stat.isDirectory()) {
            // 目标路径存在，但不是目录
            fs.renameSync(dirPath, `${dirPath}.bak`) // 将此文件重命名为 .bak 后缀
            fs.mkdirSync(dirPath)
        }
    } catch (err) {
        // 目标路径不存在
        fs.mkdirSync(dirPath)
    }
}

/**
 * 复制文件
 */
function copyFile(fromPath, toPath) {
    recursiveMkdir(path.dirname(toPath))
    return fs.createReadStream(fromPath).pipe(fs.createWriteStream(toPath))
}

/**
 * 复制目录
 */
function copyDir(fromPath, toPath) {
    try {
        fs.accessSync(fromPath)

        const stat = fs.statSync(fromPath)
        if (stat && !stat.isDirectory()) {
            // 源路径存在，但不是目录
            return console.log(`path is not directory: "${fromPath}"`)
        }
    } catch (err) {
        // 源路径不存在
        return console.log(`path not exists: "${fromPath}"`)
    }

    const files = fs.readdirSync(fromPath)
    for (const fileName of files) {
        const filePath = path.join(fromPath, fileName)
        const distFilePath = path.join(toPath, fileName)
        const stat = fs.statSync(filePath)
        if (stat && stat.isDirectory()) {
            copyDir(filePath, distFilePath)
        } else if (stat && stat.isFile()) {
            copyFile(filePath, distFilePath)
        }
    }
}

/**
 * 计算文件 md5
 */
function md5File(filePath) {
    return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex')
}

module.exports = {
    merge,
    includes,
    isFileExisted,
    recursiveMkdir,
    copyFile,
    copyDir,
    md5File,
}
