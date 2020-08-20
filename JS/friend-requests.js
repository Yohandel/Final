firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        sendedRequests(user.uid);
        receivedRequests(user.uid);
    } else {
        window.location.href = "/HTML/Login";
    }
});

const sendedRequests = (id) => {
    let sended = document.getElementById("sended-requests");

    db.collection("friends")
        .where("sender", "==", id)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                if (doc.data().status == "sent") {
                    db
                        .doc(`users/${doc.data().receiver}`)
                        .get()
                        .then(doc => {

                            sended.innerHTML += `
               <div class="row">
               <div class="col-md-4">
                   <img class="rounded-circle" src="${doc.data().photo}" alt="" width="61" height="61">
               </div>
               <div class="col-md-4">
                   <label class="username" for="">${doc.data().userName}</label><br>
                   <label class="about" for="">${doc.data().about}</label>
               </div>
               <div class="col-md-4">
               <div class="dropdown">
               <button class="btn btn-success mt-3" id="dropdownMenuButton" data-toggle="dropdown"
                   aria-haspopup="true" aria-expanded="false">Enviada <i class="fas fa-user-clock"></i></button>
               <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                   <a class="dropdown-item" href="#">Cancelar solicitud</a>
               </div>
           </div>
               </div>
               </div>
               `
                        })
                        .catch(function (error) {
                            alert(`${error.message} ${error.code}`)

                        })
                } else {
                    sended.innerHTML = "<p>No hay novedades<p>"
                }

            });
        })

}

const receivedRequests = (id) => {
    let received = document.getElementById("received-requests");

    db.collection("friends")
        .where("receiver", "==", id)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                if (doc.data().status == "sent") {
                    db
                        .doc(`users/${doc.data().sender}`)
                        .get()
                        .then(doc => {

                            received.innerHTML += `
                        <div class="row">
                        <div class="col-md-4">
                            <img class="rounded-circle"
                                src="${doc.data().photo}" alt="" width="61"
                                height="61">
                        </div>
                        <div class="col-md-4">
                            <label class="username" for="">${doc.data().userName}</label><br>
                            <label class="about" for="">${doc.data().about}</label>
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-success mt-3" onclick="acceptRequest('${doc.id}')">Aceptar <i class="fas fa-user-plus"></i></button>
                        </div>
                    </div>
               `
                        })
                        .catch(function (error) {
                            alert(`${error.message} ${error.code}`)

                        })
                } else if (doc.data().status == "friends") {
                    received.innerHTML = "<p>No hay novedades<p>"
                }

            });
        })
}

const acceptRequest = (id) => {
    let usr = firebase.auth().currentUser;
    //Change status of a request to accepted
    db
        .collection("friends")
        .where("sender", "==", id)
        .where("receiver", "==", usr.uid)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(doc => {
                db
                    .doc(`friends/${doc.id}`)
                    .update({
                        status: "friends"
                    })
                    .then(function (doc) {

                    })
                    .catch(function (error) {
                        alert(`${error.message} ${error.code}`)

                    })
            });
        })
        .catch(function (error) {
            alert(`${error.message} ${error.code}`)

        })
}


