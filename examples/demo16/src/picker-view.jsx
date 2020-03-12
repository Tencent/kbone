import React from 'react'

class PickerView extends React.Component {
    constructor(props) {
        super(props)
        this.pickerView = React.createRef()
        this.state = {
            value: [0, 1],
        }
        this.onChange = evt => {
            console.log(evt.detail.value)
            this.setState({
                value: evt.detail.value,
            })
        }
    }

    componentDidMount() {
        this.pickerView.current.addEventListener('change', this.onChange)
    }

    componentWillUnmount() {
        this.pickerView.current.removeEventListener('change', this.onChange)
    }

    render() {
        return (
            <wx-picker-view ref={this.pickerView} style={{width: '100%', height: '300px'}} value={this.state.value}>
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
