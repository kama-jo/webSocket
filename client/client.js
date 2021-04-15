const socket = io('http://localhost:3000')
socket.on('connect', () => {
    socket.emit('identify', {
        session: 123456789,
        id: 1,
        service: "test",
        onglet: "onglet1"
    })
    console.log("Connecté")
})
