firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        let contacts = document.getElementById("contacs-list");

        db.collection("users").onSnapshot(querySnapshot => {
            contacts.innerHTML = ``
            querySnapshot.forEach(doc => {
                if (doc.data().email != user.email) {
                    contacts.innerHTML += `
                <li>
                <div class="row">
                    <div class="col-md-2"><img src="${doc.data().photo}" class="rounded-circle"
                            alt="..." height="61" width="61"></div>
                    <div class="col-md-7 text-center">
                        <label for="" id="username">${doc.data().userName}</label><br>
                        <label for="" id="userAbout">${doc.data().about} </label>
                    </div>
                    <div class="col-md-3">
                        <button type="submit" class="btn btn-success otro" id="btn${doc.id}" onclick="friendRequest('${doc.id}')">
                        Agregar <i class="fas fa-user-plus" ></i>
                        </button>
                    </div>
                </div>
            </li>`
                }
            });
        })

        contactsFilter(user);


    } else {
        window.location.href = "/HTML/Login";
    }
});


const contactsFilter = (user) => {

    let DBfriends = db.collection("friends");

    DBfriends
        .where("sender", "==", user.uid)
        .where("status", "==", "sent")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(doc => {
                document.getElementById(`btn${doc.data().receiver}`).disabled = true
                document.getElementById(`btn${doc.data().receiver}`).innerHTML = `Enviada <i class="fas fa-user-clock"></i>`
            });
        })
        .catch(function (error) {
            alert(`${error.message} ${error.code}`)

        })

    DBfriends
        .where("sender", "==", user.uid)
        .where("status", "==", "friends")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(doc => {
                document.getElementById(`btn${doc.data().receiver}`).disabled = true
                document.getElementById(`btn${doc.data().receiver}`).innerHTML = `Amigo <i class="fas fa-user-friends"></i>`
            });
        })
        .catch(function (error) {
            alert(`${error.message} ${error.code}`)

        })

    DBfriends
        .where("receiver", "==", user.uid)
        .where("status", "==", "friends")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(doc => {
                console.log(doc.data().receiver)
                document.getElementById(`btn${doc.data().sender}`).disabled = true
                document.getElementById(`btn${doc.data().sender}`).innerHTML = `Amigo <i class="fas fa-user-friends"></i>`
            });
        })
        .catch(function (error) {
            alert(`${error.message} ${error.code}`)

        })


}


const friendRequest = (id) => {
    let btn = document.getElementById(`btn${id}`);
    btn.innerHTML = `<i class="fas fa-spinner"></i>`;
    let usr = firebase.auth().currentUser;

    db
        .collection("friends")
        .doc()
        .set({
            sender: usr.uid,
            receiver: id,
            status: "sent"
        })
        .then(doc => {
            btn.disabled = true
            btn.innerHTML = `Sent <i class="fas fa-user-clock"></i>`
        })
        .catch(function  (error) { 
    alert(`${error.message} ${error.code}`)
            alert(`${error.message} ${error.code}`)
        })

}