const Express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = Express()
const port = 8000

const server = http.Server(app)
const io = socketio(server)

app.use(Express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile('/index.html')
})

let clientsCount = 0
const clients = {}

io.on('connection', socket => {
    const clientId = socket.client.id
    const clientName = `User ${++clientsCount}`
    clients[clientId] = clientName

    io.emit('chat message', `${clientName} connected`)

    socket.on('chat message', msg => {
        io.emit('chat message', `${clients[clientId]}: ${msg}`)
    })

    socket.on('/name', name => {
        io.emit('chat message', `${clients[clientId]} is ${name} now`)
        clients[clientId] = name
    })

    socket.on('/help', () => {
        io.emit('chat message',
            `List of commands: /name, /help`)
    })

    socket.on('/p', obj => {
        const name = obj.to
        const msg = obj.msg

        for (let key in clients) {
            const n = clients[key]
            if (n === name) {
                const id = key
                io.emit('/p', {
                    senderId: clientId,
                    receiverId: id,
                    senderMsg: `To ${name}: ${msg}`,
                    receiverMsg: `From ${clients[clientId]}: ${msg}`
                })
            }
        }
    })

    socket.on('typing', id => {
        io.emit('typing', clients[id])
    })

    socket.on('disconnect', () => {
        io.emit('chat message', `${clients[clientId]} disconnected`)
        clients[clientId] = null
        clientsCount--
    })
})

server.listen(port, () => {
    console.info(`Listening on http://localhost:${port}`)
})
