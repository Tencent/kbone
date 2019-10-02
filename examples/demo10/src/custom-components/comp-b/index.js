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
    },
    data: {
        str: _.getWords() + 'comp-b',
    },
})
