import React from 'react'
import {render, h} from 'react-dom'
import App from './app'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  render(<App />, container)
}
