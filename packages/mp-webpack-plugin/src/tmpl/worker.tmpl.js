/* eslint-disable */
/* 通用方法 */
var __SEND__ = function(pageId, data) {
    worker.postMessage({
        type: 'message',
        pageId: pageId,
        data: data
    })
};
/* 处理 worker */
var onmessage, __PAGE_ID__, navigator, location;
var postMessage = function(data) {
    if (__PAGE_ID__) {
        __SEND__(__PAGE_ID__, data)
    }
};
/* 处理 sharedWorker */
var onconnect;
var __PORTS__ = {};
var MessagePort = function(options) {
    this.pageId = options.pageId;
    this._handlers = {};
    this.onmessage = null;
};
MessagePort.prototype = {
    postMessage: function(data) {
        __SEND__(this.pageId, data);
    },
    start: function() {},
    _trigger: function(evt) {
        if (typeof this.onmessage === 'function') {
            this.onmessage(evt)
        }
        if (this._handlers[evt.type]) {
            this._handlers[evt.type].forEach(function(handler) {
                handler.call(this, evt);
            });
        }
    },
    addEventListener: function(name, handler) {
        this._handlers[name] = this._handlers[name] || [];
        this._handlers[name].push(handler);
    },
    removeEventListener: function(name, handler) {
        if (this._handlers[name]) {
            this._handlers[name].splice(this._handlers[name].indexOf(handler), 1);
        }
    }
};
/* 监听 message */
worker.onMessage(function(res) {
    if (!res.pageId) {
        return;
    }
    if (res.type === 'connect') {
        if (typeof onconnect === 'function') {
            /* sharedWorker */
            var port = new MessagePort(res);
            __PORTS__[res.pageId] = port;
            onconnect({ports: [port]});
        } else {
            /* worker */
            __PAGE_ID__ = res.pageId;
            navigator = res.navigator;
            location = res.location;
        }
    } else if (res.type === 'message') {
        if (!__PAGE_ID__) {
            /* sharedWorker */
            var port = __PORTS__[res.pageId];
            if (port) {
                port._trigger({type: 'message', data: res.data});
            }
        } else {
            /* worker */
            if (typeof onmessage === 'function' && res.pageId === __PAGE_ID__) {
                onmessage({type: 'message', data: res.data});
            }
        }
    }
});
