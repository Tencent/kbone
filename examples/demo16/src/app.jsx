import React from 'react'
import {render, h} from 'react-dom'
import './app.css'

const App = (props, store) => {
    return (
        <div>
            我是输入框：
            <input
                onClick={e => console.log('click', e)}
                onInput={e => console.log('input', e)}
                onFocus={e => console.log('focus', e)}
                onBlur={e => console.log('blur', e)}
                onChange={e => console.log('change', e)}
                onConfirm={e => console.log('confirm', e)}
                onKeyBoardHeightChange={e => console.log('KeyBoardHeightChange', e)}
            />
        </div>
    )
}

export default App
