import React from 'react'

class PickerView extends React.Component {
    constructor(props) {
        super(props)
        const pickerViewChangeTs = +new Date()
        window[pickerViewChangeTs] = this.onChange = evt => {
            console.log('picker-view', evt.detail.value)
            this.setState({
                value: evt.detail.value,
            })
        }
        this.state = {
            value: [0, 1],
            eventMap: JSON.stringify({
                change: pickerViewChangeTs,
            }),
        }
    }

    render() {
        return (
            <wx-picker-view style={{width: '100%', height: '300px'}} value={this.state.value} kbone-event-map={this.state.eventMap}>
                <wx-picker-view-column>
                    <div>春</div>
                    <div>夏</div>
                    <div>秋</div>
                    <div>冬</div>
                </wx-picker-view-column>
                <wx-picker-view-column>
                    <div>2011</div>
                    <div>2012</div>
                    <div>2013</div>
                    <div>2014</div>
                    <div>2015</div>
                    <div>2016</div>
                    <div>2017</div>
                    <div>2018</div>
                </wx-picker-view-column>
            </wx-picker-view>
        )
    }
}

export default PickerView
