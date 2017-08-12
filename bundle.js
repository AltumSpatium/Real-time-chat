$(() => {
    const socket = io()
    $('form').submit(() => {
        const msg = $('#m').val()
        const [ command, ...rest ] = msg.split('|')

        switch (command) {
            case '/name':
                socket.emit('/name', rest.join(''))
                break
            case '/help':
                socket.emit('/help')
                break
            case '/p':
                const privateMsg = { to: rest[0], msg: rest[1] }
                socket.emit('/p', privateMsg)
                break
            default:
                socket.emit('chat message', msg)
                break
        }

        $('#m').val('')
        return false
    })

    $('#m').keypress(() => {
        socket.emit('typing', socket.id)
    })

    socket.on('typing', name => {
        $('#typing').text(`${name} is typing...`).show().delay(3000).fadeOut()
    })

    socket.on('chat message', msg => {
        $('#messages').append($('<li>').text(msg))
    })

    socket.on('/p', ({senderId, receiverId, senderMsg, receiverMsg}) => {
        if (socket.id === senderId) {
            $('#messages').append($('<li>')
                .css('background-color', 'pink').text(senderMsg))
        }
        if (socket.id === receiverId) {
            $('#messages').append($('<li>')
                .css('background-color', 'pink').text(receiverMsg))
        }
    })
})
