const tool = require('./tool')

/**
 * relations 不支持跨自定义组件，得在逻辑层解决
 */
function useForm() {
    const checkFromPage = formPage => {
        const source = formPage.$$wxCustomComponent
        const nodeId = formPage.$$nodeId
        const cellsList = formPage.querySelectorAll('wx-custom-component[behavior=mp-cells]')

        // link
        cellsList.forEach(item => {
            item._linkFormPage = item._linkFormPage || {}
            if (!item._linkFormPage[nodeId]) {
                item._linkFormPage[nodeId] = true

                const target = item.$$wxCustomComponent
                if (!source.data.firstItem) source.data.firstItem = target
                target.setOuterClass('weui-cells__group weui-cells__group_form weui-cells_form')
                if (target !== source.data.firstItem) target.setOuterClass('weui-cells__group_wxss weui-cells__group weui-cells__group_form weui-cells_form')
            }
        })
    }
    const checkForm = form => {
        const source = form.$$wxCustomComponent
        const nodeId = form.$$nodeId
        const cellList = form.querySelectorAll('wx-custom-component[behavior=mp-cell]')
        const checkboxGroupList = form.querySelectorAll('wx-custom-component[behavior=mp-checkbox-group]')

        const tempMap = {}

        // link
        const totalList = [].concat(cellList, checkboxGroupList)
        totalList.forEach(item => {
            tempMap[item.$$nodeId] = true

            item._linkFrom = item._linkFrom || {}
            if (!item._linkFrom[nodeId]) {
                item._linkFrom[nodeId] = true

                const target = item.$$wxCustomComponent
                if (target.data.prop) source.data.formItems[target.data.prop] = target
                if (target.setInForm) target.setInForm()
                if (!source.data.firstItem) source.data.firstItem = target
            }
        })

        // unlink
        if (form._linkItems && form._linkItems.length) {
            form._linkItems.forEach(item => {
                if (!tempMap[item.$$nodeId]) {
                    if (item._linkFrom) item._linkFrom[nodeId] = null

                    const target = item.$$wxCustomComponent
                    if (target.data.prop) delete source.data.formItems[target.data.prop]
                }
            })
        }
        form._linkItems = totalList
    }
    const checkCells = cells => {
        const source = cells.$$wxCustomComponent
        const nodeId = cells.$$nodeId
        const cellList = cells.querySelectorAll('wx-custom-component[behavior=mp-cell]')
        const checkboxGroupList = cells.querySelectorAll('wx-custom-component[behavior=mp-checkbox-group]')

        const tempMap = {}

        // link
        cellList.forEach(item => {
            item._linkCells = item._linkCells || {}
            if (!item._linkCells[nodeId]) {
                const target = item.$$wxCustomComponent
                if (!source.data.firstItem) source.data.firstItem = target
                if (target !== source.data.firstItem) target.setOuterClass('weui-cell_wxss')
            }
        })
        checkboxGroupList.forEach(item => {
            tempMap[item.$$nodeId] = true

            item._linkCells = item._linkCells || {}
            if (!item._linkCells[nodeId]) {
                item._linkCells[nodeId] = true

                const target = item.$$wxCustomComponent
                target.setData({
                    checkboxCount: source.data.checkboxCount + 1,
                    checkboxIsMulti: target.data.multi
                })

                // item 的 link 操作
                if (!target.data.parentCell) target.data.parentCell = source
                target.setParentCellsClass()
            }
        })

        // unlink
        if (cells._linkCheckboxGroups && cells._linkCheckboxGroups.length) {
            cells._linkCheckboxGroups.forEach(item => {
                if (!tempMap[item.$$nodeId]) {
                    if (item._linkCells) item._linkCells[nodeId] = null

                    const target = item.$$wxCustomComponent
                    source.setData({
                        checkboxCount: source.data.checkboxCount - 1,
                        checkboxIsMulti: target.data.multi
                    })

                    // item 的 unlink 操作
                    target.data.parentCell = null // 方便内存回收
                }
            })
        }
        cells._linkCheckboxGroups = checkboxGroupList
    }
    const checkCheckboxGroup = checkboxGroup => {
        const source = checkboxGroup.$$wxCustomComponent
        const nodeId = checkboxGroup.$$nodeId
        const checkboxList = checkboxGroup.querySelectorAll('wx-custom-component[behavior=mp-checkbox]')

        const tempMap = {}

        // link
        checkboxList.forEach(item => {
            tempMap[item.$$nodeId] = true

            item._linkGroups = item._linkGroups || {}
            if (!item._linkGroups[nodeId]) {
                item._linkGroups[nodeId] = true

                const target = item.$$wxCustomComponent
                source.data.targetList.push(target)
                target.setMulti(source.data.multi)
                if (!source.data.firstItem) source.data.firstItem = target
                if (target !== source.data.firstItem) target.setOuterClass('weui-cell_wxss')

                // item 的 link 操作
                target.data.group = source
            }
        })

        // unlink
        if (checkboxGroup._linkItems && checkboxGroup._linkItems.length) {
            checkboxGroup._linkItems.forEach(item => {
                if (!tempMap[item.$$nodeId]) {
                    if (item._linkGroups) item._linkGroups[nodeId] = null

                    const target = item.$$wxCustomComponent

                    let index = -1
                    source.data.targetList.forEach((item, i) => {
                        if (item === target) index = i
                    })
                    source.data.targetList.splice(index, 1)
                    if (!source.data.targetList) source.data.firstItem = null

                    // item 的 unlink 操作
                    target.data.group = null
                }
            })
        }
        checkboxGroup._linkItems = checkboxList
    }
    window.addEventListener('$$domTreeUpdate', tool.throttle(() => {
        Promise.resolve().then(() => {
            const formPageList = document.querySelectorAll('wx-custom-component[behavior=mp-form-page]')
            formPageList.forEach(checkFromPage)

            const formList = document.querySelectorAll('wx-custom-component[behavior=mp-form]')
            formList.forEach(checkForm)

            const cellsList = document.querySelectorAll('wx-custom-component[behavior=mp-cells]')
            cellsList.forEach(checkCells)

            const checkboxGroupList = document.querySelectorAll('wx-custom-component[behavior=mp-checkbox-group]')
            checkboxGroupList.forEach(checkCheckboxGroup)
        }).catch(console.error)
    }))
}

module.exports = {
    useForm,
}
