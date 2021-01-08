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
        testDefaultVal: {
            type: String,
            value: 'hello kbone',
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
