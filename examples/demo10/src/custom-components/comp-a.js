const _ = require('./common/utils')

Component({
    properties: {
        prefix: {
            type: String,
            value: 'defaultPrefix',
        },
        suffix: {
            type: String,
            value: 'defaultSuffix',
        },
    },
    data: {
        str: _.getWords() + 'comp-a',
    },
    methods: {
        onTap() {
            this.triggerEvent('someevent', {
                detail: {
                    from: 'comp-a',
                },
            })
        },

        printf() {
            console.log('I am comp-a')
        },
    },
})
