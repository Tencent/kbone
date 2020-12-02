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
        testObj: {
            type: Object,
            value: {},
        },
        testArr: {
            type: Array,
            value: [],
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
