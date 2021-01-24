import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpUploader extends WeuiBase {
    constructor() {
        super()

        this._currentFiles = []

        this.initShadowRoot(template, MpUploader.observedAttributes, () => {
            this.previewImage = this.previewImage.bind(this)
            this.chooseImage = this.chooseImage.bind(this)
            this.deleteImage = this.deleteImage.bind(this)
            this.uploader = this.shadowRoot.querySelector('.weui-uploader')
            this.titleDom = this.shadowRoot.querySelector('.weui-uploader__title')
            this.info = this.shadowRoot.querySelector('.weui-uploader__info')
            this.tipsDom = this.shadowRoot.querySelector('.weui-uploader__tips')
            this.slotTips = this.shadowRoot.querySelector('#slot-tips')
            this.filesCnt = this.shadowRoot.querySelector('.weui-uploader__files')
            this.addDom = this.shadowRoot.querySelector('.weui-uploader__input-box')
            this.addInner = this.addDom.querySelector('.weui-uploader__input')
            this.gallery = this.shadowRoot.querySelector('.gallery')
        })
    }

    static register() {
        customElements.define('mp-uploader', MpUploader)
    }

    connectedCallback() {
        super.connectedCallback()

        this.addInner.addEventListener('tap', this.chooseImage)
        this.gallery.addEventListener('delete', this.deleteImage)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.addInner.removeEventListener('tap', this.chooseImage)
        this.gallery.removeEventListener('delete', this.deleteImage)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.uploader.className = `weui-uploader ${this.extClass}`
        } else if (name === 'title') {
            this.titleDom.innerText = this.title
        } else if (name === 'tips') {
            const tips = this.tips
            this.tipsDom.classList.toggle('hide', !tips)
            this.slotTips.classList.toggle('hide', !!tips)
            this.tipsDom.innerText = tips
        } else if (name === 'show-delete') {
            this.gallery.setAttribute('show-delete', this.showDelete)
        } else if (name === 'max-count') {
            const maxCount = this.maxCount
            this.info.classList.toggle('hide', maxCount <= 1)
            this.updateInfoAndAddDom()
        } else if (name === 'files') {
            this._currentFiles = this.files
            this.updateInfoAndAddDom()
            this.updateFiles()
        }
    }

    static get observedAttributes() {
        return ['title', 'tips', 'show-delete', 'size-type', 'source-type', 'max-size', 'max-count', 'files', 'select', 'upload', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get title() {
        return this.getAttribute('title') || ''
    }

    get tips() {
        return this.getAttribute('tips') || ''
    }

    get showDelete() {
        return this.getBoolValue('show-delete', true)
    }

    get sizeType() {
        // size-type 不支持
        return null
    }

    get sourceType() {
        // source-type 不支持
        return null
    }

    get maxSize() {
        return this.getNumberValue('max-size', 5 * 1024 * 1024)
    }

    get maxCount() {
        return this.getNumberValue('max-count', 1)
    }

    get files() {
        return this.getObjectValue('files', [])
    }

    get select() {
        return this.getAttribute('select')
    }

    get upload() {
        return this.getAttribute('upload')
    }

    /**
     * 更新部分元素
     */
    updateInfoAndAddDom() {
        const maxCount = this.maxCount
        const currentFiles = this._currentFiles
        this.info.innerText = `${currentFiles.length}/${maxCount}`
        this.addDom.classList.toggle('hide', currentFiles.length >= maxCount)
    }

    /**
     * 更新图片列表
     */
    updateFiles() {
        const files = this._currentFiles

        this.filesCnt.innerHTML = ''
        if (files.length) {
            const documentFragment = document.createDocumentFragment()
            files.forEach((item, index) => {
                const wxView = this.createItem(item)
                wxView.dataset.index = index
                documentFragment.appendChild(wxView)
            })
            this.filesCnt.appendChild(documentFragment)
        }
    }

    /**
     * 创建图片项
     */
    createItem(item) {
        const wxView = document.createElement('wx-view')
        if (item.error) {
            wxView.className = 'weui-uploader__file weui-uploader__file_status'
            wxView.innerHTML = `<wx-image class="weui-uploader__img" src="${item.url}" mode="aspectFill"></wx-image>
                <div class="weui-uploader__file-content">
                <wx-icon type="warn" size="23" color="#F43530"></wx-icon>
            </div>`
        } else if (item.loading) {
            wxView.className = 'weui-uploader__file weui-uploader__file_status'
            wxView.innerHTML = `<wx-image class="weui-uploader__img" src="${item.url}" mode="aspectFill"></wx-image>
            <div class="weui-uploader__file-content">
                <div class="weui-loading"></div>
            </div>`
        } else {
            wxView.className = 'weui-uploader__file'
            wxView.innerHTML = `<wx-image class="weui-uploader__img" src="${item.url}" mode="aspectFill"></wx-image>`
        }

        wxView.addEventListener('tap', this.previewImage)

        return wxView
    }

    /**
     * 删除图片项
     */
    deleteItem(index) {
        const child = this.filesCnt.children[index]
        if (child) {
            this.filesCnt.removeChild(child)
            child.removeEventListener('tap', this.previewImage)
        }

        for (let i = 0, len = this._currentFiles.length; i < len; i++) {
            const child = this.filesCnt.children[i]
            if (child) child.dataset.index = i
        }
    }

    /**
     * 预览图片
     */
    previewImage(evt) {
        const index = evt.currentTarget.dataset.index
        const previewImageUrls = this._currentFiles.map(item => item.url)

        this.gallery.setAttribute('img-urls', previewImageUrls)
        this.gallery.setAttribute('current', index)
        this.gallery.setAttribute('show', true)
    }

    /**
     * 选择图片
     * cancel 事件不支持
     */
    chooseImage() {
        if (this._uploading) return

        // 选择图片
        let fileInput = this.shadowRoot.querySelector('input.upload-image-input[type=file]')
        if (fileInput == null) {
            fileInput = document.createElement('input')
            fileInput.style.display = 'none'
            fileInput.setAttribute('type', 'file')
            fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
            fileInput.classList.add('upload-image-input')
            fileInput.addEventListener('change', () => {
                const tempFiles = Array.prototype.slice.call(fileInput.files).slice(0, this.maxCount - this._currentFiles.length)
                const res = {
                    contents: [],
                    tempFilePaths: [],
                    tempFiles: [],
                }
                const promiseList = tempFiles.map(file => new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => {
                        const base64 = reader.result
                        let originalBase64 = base64
                        if (base64.indexOf('data:') === 0 && base64.indexOf('base64') > 0) {
                            originalBase64 = base64.slice(base64.indexOf(',') + 1)
                        }
                        res.tempFilePaths.push(base64)

                        const binaryString = window.atob(originalBase64)
                        const len = binaryString.length
                        const bytes = new Uint8Array(len)
                        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i)
                        const buffer = bytes.buffer
                        res.contents.push(buffer)

                        res.tempFiles.push({path: base64, size: file.size})
                        resolve()
                    }
                    reader.onerror = err => reject(err)
                    reader.onabort = () => reject()
                    reader.readAsDataURL(file)
                }))
                Promise.all(promiseList).then(() => {
                    // 过滤
                    if (typeof this.select === 'function') {
                        const ret = this.select(res)
                        if (ret === false) return
                    }

                    // 检查大小
                    let invalidIndex = -1
                    res.tempFiles.forEach((item, index) => {
                        if (item.size > this.maxSize) invalidIndex = index
                    })
                    if (invalidIndex >= 0) {
                        this.dispatchEvent(new CustomEvent('fail', {
                            bubbles: true,
                            cancelable: true,
                            detail: {
                                type: 1,
                                errMsg: `chooseImage:fail size exceed ${this.maxSize}`,
                                total: res.tempFilePaths.length,
                                index: invalidIndex,
                            }
                        }))
                        return
                    }

                    // 触发选中的事件，开发者根据内容来上传文件，上传了把上传的结果反馈到 files 属性里面
                    this.dispatchEvent(new CustomEvent('select', {bubbles: true, cancelable: true, detail: res}))
                    const files = res.tempFilePaths.map(item => ({
                        loading: true,
                        url: item
                    }))
                    if (!files || !files.length) return

                    // 上传
                    if (typeof this.upload === 'function') {
                        // 追加内容到本地列表
                        const len = this._currentFiles.length
                        const newFiles = this._currentFiles.concat(files)
                        this._currentFiles = newFiles
                        this.updateInfoAndAddDom()

                        // 更新 dom
                        const documentFragment = document.createDocumentFragment()
                        files.forEach((item, index) => {
                            const wxView = this.createItem(item)
                            wxView.dataset.index = len + index
                            documentFragment.appendChild(wxView)
                        })
                        this.filesCnt.appendChild(documentFragment)

                        // 调上传接口
                        this._loading = true
                        this.upload(res)
                            .then(json => {
                                this._loading = false
                                if (json.urls) {
                                    const children = this.filesCnt.children
                                    json.urls.forEach((url, index) => {
                                        const offsetIndex = len + index
                                        const item = this._currentFiles[offsetIndex]
                                        item.url = url
                                        item.loading = false

                                        // 更新 dom
                                        const child = children[offsetIndex]
                                        if (child) {
                                            const wxView = this.createItem(item)
                                            wxView.dataset.index = child.dataset.index
                                            this.filesCnt.replaceChild(wxView, child)
                                        }
                                    })

                                    this.dispatchEvent(new CustomEvent('success', {bubbles: true, cancelable: true, detail: json}))
                                } else {
                                    this.dispatchEvent(new CustomEvent('fail', {
                                        bubbles: true,
                                        cancelable: true,
                                        detail: {
                                            type: 3,
                                            errMsg: 'upload file fail, urls not found',
                                        }
                                    }))
                                }
                            })
                            .catch(err => {
                                this._loading = false
                                const children = this.filesCnt.children
                                res.tempFilePaths.forEach((path, index) => {
                                    const offsetIndex = len + index
                                    const item = this._currentFiles[offsetIndex]
                                    item.error = true
                                    item.loading = false

                                    // 更新 dom
                                    const child = children[offsetIndex]
                                    if (child) {
                                        const wxView = this.createItem(item)
                                        wxView.dataset.index = child.dataset.index
                                        this.filesCnt.replaceChild(wxView, child)
                                    }
                                })

                                this.dispatchEvent(new CustomEvent('fail', {
                                    bubbles: true,
                                    cancelable: true,
                                    detail: {
                                        type: 3,
                                        errMsg: 'upload file fail',
                                        error: err,
                                    }
                                }))
                            })
                    }
                }).catch(console.error)
            })
            this.shadowRoot.appendChild(fileInput)
        }
        fileInput.click()
    }

    /**
     * 删除图片
     */
    deleteImage(evt) {
        const index = +evt.detail.index
        const file = this._currentFiles.splice(index, 1)
        this.deleteItem(index)

        this.updateInfoAndAddDom()
        this.dispatchEvent(new CustomEvent('delete', {bubbles: true, cancelable: true, detail: {index, item: file[0]}}))
    }
}
