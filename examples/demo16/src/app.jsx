import React, {useState} from 'react'
import {render, h} from 'react-dom'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './app.css'

import PickerView from './picker-view'
import View1 from './view1'
import View2 from './view2'
import View3 from './view3'

const App = (props, store) => {
    const pickerRange1 = ['中国', '美国', '巴西', '日本']
    const [pickerRange2, setPickerRange2] = useState([
        {name: '中国'},
        {name: '美国'},
        {name: '巴西'},
        {name: '日本'}
    ])
    const scrollViewProps = {
        className: 'scroll-view-y',
        'scroll-y': true,
        'scroll-with-animation': true,
        'refresher-enabled': true,
    }

    const [selectOptions, setSelectOptions] = useState([
        {name: '葡萄柚', value: "grapefruit"},
        {name: '柠檬', value: "lime"},
        {name: '椰子', value: "coconut"}
    ])

    const [favorite, setFavorite] = useState("lime")

    return (
        <div>
            <div>
                我是输入框：
                <input
                    onClick={e => console.log('click', e)}
                    onInput={e => console.log('input', e)}
                    onFocus={e => console.log('focus', e)}
                    onBlur={e => console.log('blur', e)}
                    onChange={e => console.log('change', e)}
                />
            </div>
            <div>
                我是 checkbox：
                <input
                    type="checkbox"
                    onChange={e => console.log('change', e)}
                />
            </div>
            <div>
                我是 radio：
                <input
                    type="radio"
                    name="radio"
                    value="1"
                    onChange={e => console.log('change', e.target.value)}
                />
                <input
                    type="radio"
                    name="radio"
                    value="2"
                    onChange={e => console.log('change', e)}
                />
            </div>
            <div>
                选择你喜欢的风味:
                <select value={favorite} defaultValue="coconut" onChange={e => { console.log('change', e.target.value); setFavorite(e.target.value)}}>
                    {
                        selectOptions.map((opt) => {
                            return (
                                <option value={opt.value}>{opt.name}</option>
                                // <option value={opt.value}  selected={ favorite == opt.value }>{opt.name}</option>
                            )
                        })
                    }
                </select>
                <button onClick={e => setSelectOptions(selectOptions.concat([{name: '芒果', value: "mango"}])) }>我还想吃芒果</button>
            </div>
            <div>
                我想吃的水果是：{favorite}
            </div>


            <div>
                我是 picker-view：
                <wx-picker range={pickerRange1} onChange={e => console.log('change', e)}>选择国家1</wx-picker>
                <wx-picker range={pickerRange2} range-key="name" onChange={e => console.log('change', e)}>选择国家2</wx-picker>
            </div>
            <div>
                我是 scroll-view：
                <wx-scroll-view {...scrollViewProps}>
                <div>
                    <div class="block block1"></div>
                    <div class="block block2"></div>
                    <div class="block block3"></div>
                    <div class="block block4"></div>
                    <div class="block block5"></div>
                </div>
                </wx-scroll-view>
            </div>
            <div>
                我是 picker-view：
                <PickerView></PickerView>
            </div>
            <Router>
                <div>react-router</div>
                <ul>
                    <li><Link to="/view1">view1</Link></li>
                    <li><Link to="/view2">view2</Link></li>
                    <li><Link to="/view3">view3</Link></li>
                </ul>
                <Switch>
                    <Route path="/view1" component={View1}></Route>
                    <Route path="/view2" component={View2}></Route>
                    <Route path="/:view" component={View3}></Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App
