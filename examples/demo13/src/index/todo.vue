<template>
  <div class="container">
    <div class="title">todos</div>
    <div class="form">
      <input class="new-todo" v-model="inputText" placeholder="下一步行动计划是？"></input>
      <button class="add-btn" @click="newTodo">确定</button>
    </div>
    <div class="todo-list">
      <div :class="item.done ? 'todo-item done' : 'todo-item'" v-for="item in todo" v-if="type === 'all' || (type === 'active' && !item.done) || (type === 'done' && item.done)">
        <div class="toggle" :data-id="item.id" @click="toggle"></div>
        <div >{{ item.text }} </div>
        <div class="delete" :data-id="item.id" @click="deleteItem"></div>
      </div>
    </div>
    <div class="footer">
      <div class="todo-count"><div class="strong">{{ left }} items left</div> </div>
      <div class="filters">
        <div class='ib' data-filter='all' @click="filter">
          <div :class="type === 'all' ? 'selected' : ''" >All</div>
        </div>
        <div class='ib' data-filter='active' @click="filter">
          <div :class="type === 'active' ? 'selected' : ''" >Active</div>
        </div>
        <div class='ib' data-filter='done' @click="filter">
          <div :class="type === 'done' ? 'selected' : ''" >Done</div>
        </div>
      </div>
      <button v-if="done > 0" class="clear-completed" @click="clear">Clear done</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'todo',
  data() {
    return {
      id: 1,
      todo: [{ text: '学习 Kbone', id: 0, done: false }, { text: '学习 vue', id: 1, done: false }],
      left: 2,
      type: 'all',
      done: 0,
      inputText: ''
    }
  },
  computed: {
    route() {
      return this.$route.path
    }
  },
  methods: {
    toggle(evt) {
      for (let i = 0, len = this.todo.length; i < len; i++) {
        const item = this.todo[i]
        if (item.id === Number(evt.currentTarget.dataset.id)) {
          item.done = !item.done
          this.computeCount()
          break
        }
      }
    },
    newTodo() {
      if (this.inputText.trim() === '') {
        return
      }

      this.todo.unshift({
        text: this.inputText,
        id: ++this.id,
        done: false,
        createTime: new Date()
      })
      this.computeCount()
      this.inputText = ''
    },
    deleteItem(evt) {
      for (let i = 0, len = this.todo.length; i < len; i++) {
        const item = this.todo[i]
        if (item.id === Number(evt.currentTarget.dataset.id)) {
          this.todo.splice(i, 1)
          this.computeCount()
          break
        }
      }
    },
    computeCount() {
      this.left = 0
      this.done = 0
      for (let i = 0, len = this.todo.length; i < len; i++) {
        this.todo[i].done ? this.done++ : this.left++
      }
    },

    filter(evt) {
      this.type = evt.currentTarget.dataset.filter
    },
    clear() {
      for (let i = 0, len = this.todo.length; i < len; i++) {
        const item = this.todo[i]
        if (item.done) {
          this.todo.splice(i, 1)
          len--
          i--
        }
      }
      this.done = 0
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-nickname {
  color: #aaa;
}

.title{
    width: 100%;
    font-size: 40px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.55);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
}

.new-todo{
  height: 38px;
  border: none;
  padding-left: 10px;
  /* background: rgba(0, 0, 0, 0.003); */
  display: inline-block;
  width: 280px;
}
.new-todo:after{
  border: none;
}

.add-btn{
  position: absolute;
  width: 20%;
  min-width: 70px;
  height: 40px;
  right: 0px;
  top:0px;
  border-left: 1px solid #ccc;
  border-radius: 0px;
  outline: none;
  appearance: none;
  -webkit-appearance:none;
  background: none;
  line-height: 40px;
  text-align:center;
}

.add-btn:after {
  border: none;
}

.form{
  position: relative;
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
}

.todo-list{
  width: 100%;
  padding-bottom: 40px;
}

.todo-item{
  position: relative;
 height: 40px;
 line-height: 40px;
 padding-left: 60px;
 border-bottom: 1px solid #ddd;
}

.toggle{
  position: absolute;
  left:8px;
  width: 26px;
  top:8px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #ccc;
  display: inline-block;
}

.toggle:after{
  display: none;
}

.done .toggle:after{
  display: block;
  content: '✔';
  position: relative;
  top:-8px;
  left:6px;
  color: #79ddce;
}

.delete{
  position: absolute;
  right: 8px;
  width: 32px;
  height: 32px;
  text-align: center;
  display: inline-block;
  color: rgba(175, 47, 47, 0.5);
  top:0px;
}

.delete:after{
  content: '✕'
}

.done{
    color: #d9d9d9;
    text-decoration: line-through;
}

todo-footer{
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: white;
}

.add-btn:active{
  background-color: #ddd;
}

button {
  background: none;
  font-size: 12px;
  color: #777;
}

button:after {
  border: none;
}

.todo-count {
  position: absolute;
  left: 8px;
  top: 8px;
  }

.ib {
  display: inline-block;
}

.footer {
  height: 40px;
  line-height: 28px;
  width: 100%;
  font-size: 12px;
  background-color: rgb(247, 247, 247);
  color: #777;
  position: fixed;
  bottom: 0px;
}

.clear-completed {
  position: absolute;
  top: 15px;
  right: 4px;
}

.filters {
  margin-left: 80px;
}

.filters .ib view, .filters .ib div {
  padding:0 4px;
  margin: 8px;
}

.selected{
  border: 1px solid rgba(175, 47, 47, 0.3);
}

.strong{
  font-weight: 500;
}

</style>
