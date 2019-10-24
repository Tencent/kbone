import { define, h } from 'omio'
import css from './_index.css'
import '../todo-footer'

define('todo-app', _ => {
  const { textInput, data, newTodo, done, toggle, deleteItem } = _.store
  const { todo, type, inputText } = data
  return <div class="container">
    <div class="title">todos</div>
    {/* 需要使用cdn图片 */}
    {/* <img class="github" onClick={gotoAbout} src='./github-logo.png'></img> */}
    <div class="form">
      <input class="new-todo" onInput={textInput} value={inputText} placeholder="下一步行动计划是？" autofocus=""></input>
      <button class="add-btn" onClick={newTodo}>确定</button>
    </div>

    <div class="todo-list">
      {todo.map(item => (
        (type === 'all' || (type === 'active' && !item.done) || (type === 'done' && item.done)) && <div class={`todo-item${item.done ? ' done' : ''}`}>
          <div class="toggle" data-id={item.id} onClick={toggle}></div>
          <text >{item.text} </text>
          <div class="delete" data-id={item.id} onClick={deleteItem}></div>
        </div>
      ))}
    </div>

    <todo-footer ></todo-footer>
  </div>
}, {
    css: typeof wx !== undefined ? '' : css,
    useSelf: ['todo', 'type', 'inputText']
  })

