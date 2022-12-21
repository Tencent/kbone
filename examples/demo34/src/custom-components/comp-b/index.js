const _ = require('../common/utils')

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
        name: {
            type: String,
            value: '',
        },
    },
    data: {
        str: _.getWords() + 'comp-b',
    },
})
