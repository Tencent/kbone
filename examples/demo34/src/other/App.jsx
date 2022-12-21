import React from 'react'
import { render, h } from 'react-dom'
import './App.css'

const App = (props, store) => {
  return (
    <div className="cnt">
      <h2>kbone</h2>
      <comp-e className="block" my-class="external-red">
        <div>comp-e slot</div>
      </comp-e>
    </div>
  )
}

export default App
