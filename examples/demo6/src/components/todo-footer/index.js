import { define, h } from 'omio'
import './index.css'

define('todo-footer', _ => {

  const { data, filter, clear } = _.store

  const { left, type, done } = data

  return <div class="footer">
    <div class="todo-count"><text class="strong">{left + ' '}items left</text> </div>
    <div class="filters">
      <div class='ib' data-filter='all' onClick={filter}>
        <text class={type === 'all' ? 'selected' : ''} >All</text>
      </div>
      <div class='ib' data-filter='active' onClick={filter}>
        <text class={type === 'active' ? 'selected' : ''} >Active</text>
      </div>
      <div class='ib' data-filter='done' onClick={filter}>
        <text class={type === 'done' ? 'selected' : ''} >Done</text>
      </div>
    </div>
    {done > 0 && <button class="clear-completed" onClick={clear}>Clear done</button>}
  </div>

}, {
    css: typeof wx !== undefined ? '' : css,
    use: ['left', 'type', 'done']
  })


