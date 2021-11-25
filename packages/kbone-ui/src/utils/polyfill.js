if (!window.TouchEvent) {
    window.TouchEvent = class TouchEvent extends CustomEvent {
        constructor(type, options) {
            super(type, {
                cancelable: typeof options.cancelable === 'boolean' ? options.cancelable : true,
                bubbles: typeof options.bubbles === 'boolean' ? options.bubbles : true,
            })

            this.touches = options.touches || []
            this.targetTouches = options.targetTouches || []
            this.changedTouches = options.changedTouches || []
        }
    }
}

if (!window.Touch) {
    window.Touch = class Touch {
        constructor(options = {}) {
            this.clientX = 0
            this.clientY = 0
            this.identifier = 0
            this.pageX = 0
            this.pageY = 0
            this.screenX = 0
            this.screenY = 0
            this.target = null

            Object.keys(options).forEach(key => {
                this[key] = options[key]
            })
        }
    }
}
