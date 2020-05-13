import React, {useState} from 'react'
import {render, h} from 'react-dom'
import './App.css'

import Header from '../common/Header'
import Footer from '../common/Footer'

const App = (props, store) => {
    function onClickBack() {
        wx.navigateBack()
    }

    return (
        <div className="cnt">
            <Header></Header>
            <button onClick={onClickBack}>回到上一页</button>
            <Footer></Footer>
        </div>
    )
}

export default App
