const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

const domSubTreeLevel = 10
const destDir = path.resolve(__dirname, '../src/template')

/**
 * 移除注释
 */
function removeComment(content) {
    let startIndex = content.indexOf('<!--')
    while (startIndex >= 0) {
        const endIndex = content.indexOf('-->', startIndex)
        if (endIndex >= 0) content = content.substring(0, startIndex) + content.substring(endIndex + 3)

        startIndex = content.indexOf('<!--', endIndex + 3)
    }

    return content
}

/**
 * 获取 subtree.wxml 生成单次循环内容
 */
function getSubtreeSimple(i) {
    const itemName = `item${i}`
    const isLast = i === domSubTreeLevel
    const isFirst = i === 1
    const subContent = [
        `<block wx:if="{{${itemName}.type === 'text'}}">{{${itemName}.content}}</block>`,
        `<template wx:elif="{{${itemName}.isImage}}" is="img" data="{{...${itemName}}}"/>`,
        `<template wx:elif="{{${itemName}.useTemplate}}" is="{{${itemName}.extra.wxCompName}}" data="{{...${itemName}.extra}}"/>`,
        `<view wx:elif="{{${itemName}.isLeaf${isLast ? '' : ' || ' + itemName + '.isSimple'}}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className}}" style="{{${itemName}.style}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap" bindlongpress="onLongPress">{{${itemName}.content}}${isLast ? '</view>' : ''}`
    ]

    // 递归下一层
    if (!isLast) {
        subContent.splice(4, 0, ...getSubtreeSimple(i + 1))
    }

    // 补充自定义组件
    subContent.push(`<element wx:elif="{{${itemName}.type === 'element'}}" in-cover="{{inCover}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className}}" style="{{${itemName}.style}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap" bindlongpress="onLongPress" generic:custom-component="custom-component"></element>`)

    // 补充头尾
    const outputContent = [
        `<block wx:for="{{${!isFirst ? 'item' + (i - 1) + '.' : ''}childNodes}}" wx:key="nodeId" wx:for-item="${itemName}">`,
        ...subContent,
        '</block>'
    ]

    // 补充上一层的结束标签
    if (!isFirst) {
        outputContent.push('</view>')
    }

    return outputContent
}

/**
 * 获取 subtree-cover.wxml 生成单次循环内容
 */
function getSubtreeCoverSimple(i) {
    const itemName = `item${i}`
    const isLast = i === domSubTreeLevel
    const isFirst = i === 1
    const subContent = [
        `<template wx:if="{{${itemName}.isImage}}" is="cover-img" data="{{...${itemName}}}"/>`,
        `<template wx:elif="{{${itemName}.useTemplate}}" is="{{${itemName}.extra.wxCompName}}" data="{{...${itemName}.extra}}"/>`,
        `<cover-view wx:elif="{{${itemName}.type === 'text' || ${itemName}.isLeaf || ${itemName}.isSimple}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className}}" style="{{${itemName}.style}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap" bindlongpress="onLongPress">{{${itemName}.content}}${isLast ? '</cover-view>' : ''}`
    ]

    // 递归下一层
    if (!isLast) {
        subContent.splice(3, 0, ...getSubtreeCoverSimple(i + 1))
    }

    // 补充自定义组件
    subContent.push(`<element wx:elif="{{${itemName}.type === 'element'}}" in-cover="{{true}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className}}" style="{{${itemName}.style}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap" bindlongpress="onLongPress" generic:custom-component="custom-component"></element>`)

    // 补充头尾
    const outputContent = [
        `<block wx:for="{{${!isFirst ? 'item' + (i - 1) + '.' : ''}childNodes}}" wx:key="nodeId" wx:for-item="${itemName}">`,
        ...subContent,
        '</block>'
    ]

    // 补充上一层的结束标签
    if (!isFirst) {
        outputContent.push('</cover-view>')
    }

    return outputContent
}

/**
 * 生成 src/template/subtree.wxml
 */
function createSubtreeTemplate() {
    const content = [
        '<import src="./inner-component.wxml"/>',
        '<template name="subtree">',
        ...getSubtreeSimple(1),
        '</template>'
    ]

    // 写入文件
    fs.writeFileSync(path.join(destDir, './subtree.wxml'), content.join(''), 'utf8')
}

/**
 * 生成 src/template/subtree-cover.wxml
 */
function createSubtreeCoverTemplate() {
    const content = [
        '<import src="./inner-component.wxml"/>',
        '<template name="subtree-cover">',
        ...getSubtreeCoverSimple(1),
        '</template>'
    ]

    // 写入文件
    fs.writeFileSync(path.join(destDir, './subtree-cover.wxml'), content.join(''), 'utf8')
}

/**
 * 生成 src/template/inner-component.wxml
 */
function createInnerComponentTemplate() {
    let template = fs.readFileSync(path.join(__dirname, './inner-component.wxml'), 'utf8')
        .replace(/[\n\r\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/>\s</g, '><')
    template = removeComment(template)

    // 写入文件
    fs.writeFileSync(path.join(destDir, './inner-component.wxml'), template, 'utf8')
}

/**
 * 生成 src/index.wxml 和 src/index-vhost.wxml
 */
function createIndexTemplate() {
    let template = fs.readFileSync(path.join(__dirname, './index.wxml'), 'utf8')
        .replace(/[\n\r\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/>\s</g, '><')
    template = removeComment(template)

    // 写入文件
    fs.writeFileSync(path.join(destDir, '../index.wxml'), template, 'utf8')
    fs.writeFileSync(path.join(destDir, '../index-vhost.wxml'), template, 'utf8')
}

/**
 * 构建
 */
function build() {
    webpack(webpackConfig).run((err, stats) => {
        if (err) {
            console.log(err)
        } else {
            console.log(stats.toString({
                assets: true,
                cached: false,
                colors: true,
                children: false,
                errors: true,
                warnings: true,
                version: true,
                modules: false,
                publicPath: true,
            }))
        }
    })
}

function main() {
    createSubtreeTemplate()
    createSubtreeCoverTemplate()
    createInnerComponentTemplate()
    createIndexTemplate()

    build()
}
main()
