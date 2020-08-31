firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        friends(user.uid);
        blocked(user.uid);
    } else {
        window.location.href = "/HTML/Login";
    }
});


const friends = (id) => {
    let DBfriends = db.collection("friends");
    let friends = document.getElementById("friends-list");

    DBfriends
        .where("status", "==", "friends")
        .onSnapshot(querySnapshot => {
            friends.innerHTML = ``;
            querySnapshot.forEach(friend => {
                if (id == friend.data().sender || id == friend.data().receiver) {
                    db
                        .collection("users")
                        .where("uid", "in", [friend.data().sender, friend.data().receiver])
                        .get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(user => {
                                if (user.data().uid != id) {

                                    friends.innerHTML += `
                                    <div class="row">
                                    <div class="col-md-4">
                                        <img class="rounded-circle" src="${user.data().photo}" alt="" width="61" height="61">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="username" for="">${user.data().userName}</label><br>
                                        <label class="about" for="">${user.data().about}</label>
                                    </div>
                                    <div class="col-md-4">
                                    <div class="dropdown">
                                    <button class="btn btn-success mt-3" id="dropdownMenuButton" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" href="#" onclick = "blockUser('${user.data().uid}','${id}')">Bloquear</a>
                                        <a class="dropdown-item" href="#" onclick = "deleteUser('${user.data().uid}')">Eliminar</a>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    `
                                }
                            });
                        })
                        .catch(function (error) {
                            alert(`${error.message}${error.code}`)
                        })

                }
            });
        })

}

const blocked = (id) => {
    let blocked = document.getElementById("blocked-friends");
    let DBfriends = db.collection("friends");

    DBfriends
        .where("status", "==", "blocked")
        .where("blocker_user", "==", id)
        .onSnapshot(querySnapshot => {
            blocked.innerHTML = ``;
            querySnapshot.forEach(friend => {
                if (id == friend.data().sender || id == friend.data().receiver) {
                    db
                        .collection("users")
                        .where("uid", "in", [friend.data().sender, friend.data().receiver])
                        .get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(user => {
                                if (user.data().uid != id) {

                                    blocked.innerHTML += `
                                    <div class="row">
                                    <div class="col-md-4">
                                        <img class="rounded-circle" src="${user.data().photo}" alt="" width="61" height="61">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="username" for="">${user.data().userName}</label><br>
                                        <label class="about" for="">${user.data().about}</label>
                                    </div>
                                    <div class="col-md-4">
                                    <div class="dropdown">
                                    <button class="btn btn-success mt-3" id="dropdownMenuButton" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" href="#" onclick = "unblockUser('${user.data().uid}','${id}')">Desbloquear</a>
                                        <a class="dropdown-item" href="#"  onclick = "deleteUser('${user.data().uid}')">Eliminar</a>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    `
                                }
                            });
                        })
                        .catch(function (error) {
                            alert(`${error.message}${error.code}`)
                        })
                } else {
                    
                }

            });
        })

}



const blockUser = (user_id, current_id) => {
    let DBfriends = db.collection("friends");

    DBfriends
        .where("status", "==", "friends")
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(friend => {
                if (user_id == friend.data().sender || user_id == friend.data().receiver) {
                    if (current_id == friend.data().sender || current_id == friend.data().receiver) {
                        
                        db
                            .doc(`friends/${friend.id}`)
                            .update({
                                status: "blocked",
                                blocker_user: current_id
                            })
                            .then(function (doc) {
                                db
                                    .collection("conversations")
                                    .get()
                                    .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (doc) {
                                            if (friend.data().receiver == doc.data().creator || friend.data().receiver == doc.data().chatUser ) {
                                                if (friend.data().sender == doc.data().creator || friend.data().sender == doc.data().chatUser) {
                                                    db
                                                        .doc(`conversations/${doc.id}`)
                                                        .update({
                                                            status:"blocked"
                                                        })
                                                        .then(function (doc) {
                                                    
                                                        })
                                                        .catch(function (error) {
                                                    
                                                        })
                                                }
                                                
                                            }
                                
                                        });
                                    })
                                    .catch(function (error) {
                                
                                    })
                                alert(`Usuario bloqueado satisfactoriamente`)
                            })
                            .catch(function (error) {
                                alert(`${error.message}${error.code}`)
                            })
                    }
                }
            });
        })
        .catch(function (error) {
            alert(`${error.message}${error.code}`)
        })
}


const unblockUser = (user_id, current_id) => {
    let DBfriends = db.collection("friends");

    DBfriends
        .where("status", "==", "blocked")
        .where("blocker_user", "==", current_id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(friend => {
                if (user_id == friend.data().sender || user_id == friend.data().receiver) {
                    if (current_id == friend.data().sender || current_id == friend.data().receiver) {
                        db
                            .doc(`friends/${friend.id}`)
                            .update({
                                status: "friends",
                                blocker_user: current_id
                            })
                            .then(function (doc) {
                                db
                                .collection("conversations")
                                .get()
                                .then(function (querySnapshot) {
                                    querySnapshot.forEach(function (doc) {
                                        if (friend.data().receiver == doc.data().creator || friend.data().receiver == doc.data().chatUser ) {
                                            if (friend.data().sender == doc.data().creator || friend.data().sender == doc.data().chatUser) {
                                                db
                                                    .doc(`conversations/${doc.id}`)
                                                    .update({
                                                        status:"friends"
                                                    })
                                                    .then(function (doc) {
                                                
                                                    })
                                                    .catch(function (error) {
                                                
                                                    })
                                            }
                                            
                                        }
                            
                                    });
                                })
                                .catch(function (error) {
                            
                                })
                                alert(`Usuario desbloqueado`)
    
                            })
                            .catch(function (error) {
                                alert(`${error.message}${error.code}`)
                            })
                    }
                }
            });
        })
        .catch(function (error) {
            alert(`${error.message}${error.code}`)
        })
}

const deleteUser = (user_id) => {

    let DBfriends = db.collection("friends");

    DBfriends
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(friend => {
                if (user_id == friend.data().sender || user_id == friend.data().receiver) {
                    db
                        .doc(`friends/${friend.id}`)
                        .delete()
                        .then(function (doc) {
                            alert("Usuario eliminado")
                        })
                        .catch(function (error) {
                            alert(`${error.message}${error.code}`)
                        })
                }
            });
        })
        .catch(function (error) {
            alert(`${error.message}${error.code}`)
        })

}


