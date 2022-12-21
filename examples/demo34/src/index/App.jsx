import React, { useState, useRef, useEffect } from 'react'
import { render, h } from 'react-dom'
import './App.css'

const App = (props, store) => {
  const [suffixA] = useState('suffix-a')
  const [prefixA, setPrefixA] = useState('')
  const [prefixB, setPrefixB] = useState('prefix-b')
  const [compAData, setCompAData] = useState(JSON.stringify({
    testObj: {a: 'bye', b: 'june'},
    testArr: [1, 2, 3],
  }))

  const compARef = useRef(null)

  useEffect(() => {
    function onEvent(evt) {
      console.log('someevent', evt)
    }

    const compA = compARef.current
    compA.addEventListener('someevent', onEvent)

    return () => {
      compA.removeEventListener('someevent', onEvent)
    }
  }, [])

  function doUpdate() {
    setPrefixA('prefix-new-a')
    setPrefixB('prefix-new-b')
    setCompAData(JSON.stringify({
      testObj: {a: 'hello', b: 'kbone'},
      testArr: [1, 2, 3, 4, 5, 6, 7],
    }))

    compARef.current._wxCustomComponent.printf()
  }

  function goOther() {
    window.open('/other')
  }

  return (
    <div className="cnt">
      <h2>kbone</h2>
      <comp-a ref={compARef} className="block" prefix={prefixA} suffix={suffixA} kbone-attribute-map={compAData}>
        <div>comp-a slot</div>
      </comp-a>
      <comp-b className="block" prefix={prefixB} name="test" my-class="external-red">
        <div>comp-b slot</div>
      </comp-b>
      <comp-c
        className="block"
        onTouchStart={evt => console.log('touchstart', evt)}
        onTouchEnd={evt => console.log('touchend', evt)}
        onClick={evt => console.log('click', evt)}
      >
        <div>comp-c slot</div>
      </comp-c>
      <button className="btn" onClick={doUpdate}>update</button>
      <button className="btn" onClick={goOther}>进入 other 页面</button>
    </div>
  )
}

export default App
