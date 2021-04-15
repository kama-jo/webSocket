const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:56412"
  }
})

let users = []
let onglet = "none"

io.on('connection' , socket => {

  let currentUser = null

  socket.on('identify', ({session, id, service, onglet}) => {
    try {

      currentUser = {
        session: session,
        id: id,
        service: service,
        onglet: onglet
      }

      // On vérifie si l'user courant est déjà connecté
      let user = users.find(u => (u.id === currentUser.id && u.session === currentUser.session))
      if (user) {
        // on vérifie si les deux onglets nécessaire sont actifs
        if (currentUser.onglet !== user.onglet) {
          users.push(currentUser)
          onglet = "all"
          socket.broadcast.emit('onglet', { onglet: onglet })
        }
      }else{
        onglet = "onlyOne"
        users.push(currentUser)
      }

      socket.emit('onglet', { onglet: onglet })

    } catch (e){
      console.error(e.message)
    }
  })

  socket.on('disconnect', () => {
    if (currentUser) {
      // On retire l'onglet actif
      users = users.filter(u => (u.id === currentUser.id && u.session === currentUser.session && u.onglet !== currentUser.onglet ))
      socket.broadcast.emit('onglet', { onglet: "onlyOne" })
    }
  })

})
