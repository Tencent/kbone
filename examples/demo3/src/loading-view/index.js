Component({
    properties: {
        pageName: {
            type: String,
            value: '',
        },
    },

    attached() {
        console.log('page name: ', this.data.pageName)
    },
})