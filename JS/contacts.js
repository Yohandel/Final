firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const usr = firebase.auth().currentUser;
        let contacts = document.getElementById("contacs-list");

        db.collection("users").onSnapshot(querySnapshot => {
            contacts.innerHTML = ``
            querySnapshot.forEach(doc => {
                if (doc.data().email != usr.email) {
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
                        Add <i class="fas fa-user-plus" ></i>
                        </button>
                    </div>
                </div>
            </li>`
                }
            });
        })


        db
            .collection("friend-requests")
            .where("sender", "==", usr.uid)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(doc => {
                    document.getElementById(`btn${doc.data().receiver}`).disabled = true
                    document.getElementById(`btn${doc.data().receiver}`).innerHTML = `Sent <i class="fas fa-user-clock"></i>`
                });
            })
            .catch(function (error) {

            })

    } else {
        window.location.href = "/HTML/Login";
    }
});


const friendRequest = (id) => {
    console.log(id)
    let btn = document.getElementById(`btn${id}`);
    btn.innerHTML = `<i class="fas fa-spinner"></i>`;
    let usr = firebase.auth().currentUser;

    db
        .collection("friend-requests")
        .doc(id)
        .set({
            sender: usr.uid,
            receiver: id,
            status: "sent"
        })
        .then(doc => {
            btn.disabled = true
            btn.innerHTML = `Sent <i class="fas fa-user-clock"></i>`
        })
        .catch(function (error) {
            alert(`${error.message} ${error.code}`)
        })

}