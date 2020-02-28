import React, {useState} from 'react'

const PickerView = (props, store) => {
    const [value, setValue] = useState([0, 1]);
    function onChange(e) {
        console.log(e.detail.value);
        setValue(e.detail.value);
    }

    return (
        <wx-picker-view style={{width: '100%', height: '300px'}} onChange={onChange} value={value}>
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

export default PickerView
