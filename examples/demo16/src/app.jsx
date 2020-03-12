import React, {useState} from 'react'
import {render, h} from 'react-dom'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './app.css'

import PickerView from './picker-view'
import View1 from './view1'
import View2 from './view2'
import View3 from './view3'

const App = (props, store) => {
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
                    onChange={e => console.log('change', e)}
                />
                <input
                    type="radio"
                    name="radio"
                    value="2"
                    onChange={e => console.log('change', e)}
                />
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
