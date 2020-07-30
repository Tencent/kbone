let count = 0

onconnect = evt => {
    const port = evt.ports[0]

    port.addEventListener('message', evt => {
        count++
        console.log(`sharedWorker receive message(${count}): `, evt, evt.data)
        port.postMessage({from: 'sharedWorker', to: evt.data.from, count})
    })

    port.start()
}
