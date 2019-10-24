import { render, h } from 'omio'
import './components/todo'
import Store from './store'

render(<todo-app />, '#app', new Store)
