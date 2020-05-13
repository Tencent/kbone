import React, {useState} from 'react'
import {render, h} from 'react-dom'
import './App.css'

import Header from '../common/Header'
import Footer from '../common/Footer'

const App = (props, store) => {
    function onClickJump() {
        window.location.href = '/b'
    }
  
    function onClickOpen() {
        window.open('/c')
    }

    return (
        <div className="cnt">
            <Header></Header>
            <a href="/b">当前页跳转</a>
            <a href="/c" target="_blank">新开页面跳转</a>
            <button onClick={onClickJump}>当前页跳转</button>
            <button onClick={onClickOpen}>新开页面跳转</button>
            <Footer></Footer>
        </div>
    )
}

export default App
