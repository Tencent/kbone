import React, {useState} from 'react'
import {render, h} from 'react-dom'
import './App.css'

import Header from '../common/Header'
import Footer from '../common/Footer'

const App = (props, store) => {
    function onClickJump() {
        window.location.href = '/a'
    }
  
    function onClickOpen() {
        window.open('/c')
    }

    return (
        <div className="cnt">
            <Header></Header>
            <a href="/a">回到首页</a>
            <button onClick={onClickJump}>回到首页</button>
            <Footer></Footer>
        </div>
    )
}

export default App
