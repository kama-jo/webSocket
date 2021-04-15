const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:56412"
  }
})

let users = []

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
        if (currentUser.onglet == "onglet1" && user.onglet == "onglet2") {
          console.log("Tous les onglets sont actifs")
        }
      }else{
        users.push(currentUser)
        console.log(`Seulement l'onglet ${currentUser.onglet} est actif`)
      }


    } catch (e){
      console.error(e.message)
    }
  })

  socket.on('disconnect', () => {
    if (currentUser) {
      users = users.filter(u => u.id !== currentUser.id)
      console.log("Déconnecté")
    }
  })

})
