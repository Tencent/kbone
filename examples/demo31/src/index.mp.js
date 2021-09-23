const kbone = require('kbone-tool')
kbone.jquery.compat()

require('./index.css')
const $ = require('./jquery-3.6.0')
const getDom = require('replace-global-var-loader!html-to-js-loader!./body.html')

export default function createApp() {
    document.body.appendChild(getDom())

    const tabs = $('.nav .title-list li')
    const selectTapLine = $('.nav .icon-active')
    const pages = $('.news-list')
    const loading = $('#spin')

    function hideLoading() {
        loading.css('display', 'none')
    }

    function showPage1() {
        $(pages[1]).css('display', 'none')
        loading.css('display', 'block')
        selectTapLine.removeClass('pull-right')
        setTimeout(() => {
            $(pages[0]).css('display', 'block')
            hideLoading()
        }, 1000)
    }

    function showPage2() {
        $(pages[0]).css('display', 'none')
        loading.css('display', 'block')
        selectTapLine.addClass('pull-right')
        setTimeout(() => {
            $(pages[1]).css('display', 'block')
            hideLoading()
        }, 1000)
    }

    tabs.on('click', function () {
        const dataTab = +$(this).attr('data-tab')
        if (dataTab === 10) {
            showPage1()
        } else if (dataTab === 11) {
            showPage2()
        }
    })

    showPage1()

    window.log = (...args) => {
        console.log(...args)
    }
}
