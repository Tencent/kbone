const path = require('path')
const fs = require('fs')

const domSubTreeLevel = 10
const destDir = path.resolve(__dirname, '../src/template')
const subtreeDestPath = path.join(destDir, './subtree.wxml')
const subtreeCoverDestPath = path.join(destDir, './subtree-cover.wxml')
const innerComponentDestPath = path.join(destDir, './inner-component.wxml')

/**
 * 获取 subtree.wxml 生成单次循环内容
 */
function getSubtreeSimple(i) {
    const itemName = `item${i}`
    const isLast = i === domSubTreeLevel
    const isFirst = i === 1
    const subContent = [
        `<block wx:if="{{${itemName}.type === 'text'}}">{{${itemName}.content}}</block>`,
        `<image wx:elif="{{${itemName}.isImage}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className || ''}}" style="{{${itemName}.style || ''}}" src="{{${itemName}.src}}" rendering-mode="{{${itemName}.mode ? 'backgroundImage' : 'img'}}" mode="{{${itemName}.mode}}" lazy-load="{{${itemName}.lazyLoad}}" show-menu-by-longpress="{{${itemName}.showMenuByLongpress}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap" bindload="onImgLoad" binderror="onImgError"></image>`,
        `<template wx:elif="{{${itemName}.useTemplate}}" is="{{${itemName}.extra.wxCompName}}" data="{{...${itemName}.extra}}"/>`,
        `<view wx:elif="{{${itemName}.isLeaf${isLast ? '' : ' || ' + itemName + '.isSimple'}}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className || ''}}" style="{{${itemName}.style || ''}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap">{{${itemName}.content}}${isLast ? '</view>' : ''}`
    ]

    // 递归下一层
    if (!isLast) {
        subContent.splice(4, 0, ...getSubtreeSimple(i + 1))
    }

    // 补充自定义组件
    subContent.push(`<element wx:elif="{{${itemName}.type === 'element'}}" in-cover="{{inCover}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className || ''}}" style="{{${itemName}.style || ''}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap" generic:custom-component="custom-component"></element>`)

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
        `<cover-image wx:if="{{${itemName}.isImage}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className || ''}}" style="{{${itemName}.style || ''}}" src="{{${itemName}.src}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap" bindload="onImgLoad" binderror="onImgError"></cover-image>`,
        `<template wx:elif="{{${itemName}.useTemplate}}" is="{{${itemName}.extra.wxCompName}}" data="{{...${itemName}.extra}}"/>`,
        `<cover-view wx:elif="{{${itemName}.type === 'text' || ${itemName}.isLeaf || ${itemName}.isSimple}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className || ''}}" style="{{${itemName}.style || ''}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap">{{${itemName}.content}}${isLast ? '</cover-view>' : ''}`
    ]

    // 递归下一层
    if (!isLast) {
        subContent.splice(3, 0, ...getSubtreeCoverSimple(i + 1))
    }

    // 补充自定义组件
    subContent.push(`<element wx:elif="{{${itemName}.type === 'element'}}" in-cover="{{true}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.className || ''}}" style="{{${itemName}.style || ''}}" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindtap="onTap" generic:custom-component="custom-component"></element>`)

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
        '<!-- 此文件由 tool/index.js 生成 -->',
        '<import src="./inner-component.wxml"/>',
        '<template name="subtree">',
        ...getSubtreeSimple(1),
        '</template>'
    ]

    // 写入文件
    fs.writeFileSync(subtreeDestPath, content.join(''), 'utf8')
}

/**
 * 生成 src/template/subtree-cover.wxml
 */
function createSubtreeCoverTemplate() {
    const content = [
        '<!-- 此文件由 tool/index.js 生成 -->',
        '<import src="./inner-component.wxml"/>',
        '<template name="subtree-cover">',
        ...getSubtreeCoverSimple(1),
        '</template>'
    ]

    // 写入文件
    fs.writeFileSync(subtreeCoverDestPath, content.join(''), 'utf8')
}

/**
 * 生成 src/template/inner-component.wxml
 */
function createInnerComponentTemplate() {
    const template = fs.readFileSync(path.join(__dirname, './inner-component.wxml'), 'utf8')
        .replace(/[\n\r\t]+/g, ' ')
        .replace(/\s+/g, ' ')

    // 写入文件
    fs.writeFileSync(innerComponentDestPath, template, 'utf8')
}

function main() {
    createSubtreeTemplate()
    createSubtreeCoverTemplate()
    createInnerComponentTemplate()
}
main()
