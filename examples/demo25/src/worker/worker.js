let count = 0

onmessage = evt => {
    count++
    console.log(`worker receive message(${count}): `, evt.data)
    postMessage({from: 'worker', to: evt.data.from})
}
