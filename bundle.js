$(() => {
	const socket = io()
	$('form').submit(() => {
		const msg = $('#m').val()
		const [ command, ...rest ] = msg.split(' ')

		switch (command) {
			case '/name':
				socket.emit('/name', rest.join(' '))
				break
			case '/help':
				socket.emit('/help')
				break
			default:
				socket.emit('chat message', msg)
				break
		}

		$('#m').val('')
		return false
	})

	socket.on('chat message', msg => {
		$('#messages').append($('<li>').text(msg))
	})
})
