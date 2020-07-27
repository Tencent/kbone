import {render, h} from 'preact'
import './app.css'

const App = (props, store) => {
    const inputProps = {
        autofocus: true,
        'confirm-type': 'search',
    }
    return (
        <div>
            <div>
                我是输入框：
                <input
                    {...inputProps}
                    onClick={e => console.log('click', e)}
                    onInput={e => console.log('input', e)}
                    onFocus={e => console.log('focus', e)}
                    onBlur={e => console.log('blur', e)}
                    onChange={e => console.log('change', e)}
                    onconfirm={e => console.log('confirm', e)}
                    onkeyboardheightchange={e => console.log('KeyBoardHeightChange', e)}
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
        </div>
    )
}

export default App
