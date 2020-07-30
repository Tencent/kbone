let count = 0

onmessage = evt => {
    count++
    if (count === 1) {
        console.log('navigator: ', navigator)
        console.log('location: ', location)
    }
    console.log(`worker receive message(${count}): `, evt, evt.data)
    postMessage({from: 'worker', to: evt.data.from, count})
}
