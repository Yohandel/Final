firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        let username = document.getElementById("userName");
        let userProfile = document.getElementById("userProfile");
        let emailProfile = document.getElementById("emailProfile");
        let profilePhoto = document.getElementsByClassName("profile-photo")
        let about = document.getElementById("statusProfile")

        db.collection("users")
            .where("email", "==", user.email)
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                    username.innerHTML = doc.data().userName
                    userProfile.value = doc.data().userName
                    emailProfile.value = doc.data().email
                    about.innerHTML = doc.data().about
                    profilePhoto[0].src = doc.data().photo
                    profilePhoto[1].src = doc.data().photo
                    loadChats(user.uid);
                });
            })

    } else {
        window.location.href = "/HTML/Login";
    }
});


const loadChats = (id) => {
    const usr = firebase.auth().currentUser;
    let chats = document.getElementById("chats");
    let DBconversations = db.collection("conversations");

    DBconversations
        .where("status", "==", "friends")
        .onSnapshot(querySnapshot => {
            chats.innerHTML = ``
            querySnapshot.forEach(conver => {
                if (id == conver.data().creator || id == conver.data().chatUser) {

                    db.collection("users")
                        .where("uid", "in", [conver.data().creator, conver.data().chatUser])
                        .onSnapshot(querySnapshot => {
                            querySnapshot.forEach(user => {
                                if (user.data().uid != id) {
                                    chats.innerHTML += `
                                        <li class="chat">
                                        <div class="container chat-container">
                                            <div class="row">
                                                <div class="col-sm-3" onclick="openConversation('${user.id}','${id}')"> <img class="rounded-circle" src="${user.data().photo}" alt="" height="40" width="40"></div>
                                                <div class="col-sm-7" onclick="openConversation('${user.id}','${id}')"> <label for="">${user.data().userName}</label><br>
                                                    <small class="form-text text-muted"><label for="">Mensaje...</label></small>
                                                </div>
                                                <div class="col-sm-2">
                                                    <div class="dropdown">
                                                        <button class="btn btn-circle" type="button" id="dropdownMenuButton"
                                                            display="dinamic" data-toggle="dropdown" aria-haspopup="true"
                                                            aria-expanded="false">
                                                            <i class="fas fa-cog" class="settingsIcon"></i>
                                                        </button>
                                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                            <a class="dropdown-item" href="#" onclick="deleteConver('${user.id}','${id}')">Eliminar chat</a>
                                                            <a class="dropdown-item" href="#" data-toggle="modal"
                                                            data-target="#friendModal" onclick="friendProfile('${user.id}')">Ver contacto</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>`
                                }
                            });
                        })
                }
            })
        })



}

const logout = () => {
    firebase.auth().signOut()
        .then(res => {
            console.log(res)
        }).catch(function (error) {
            alert(`${error.message} ${error.code}`)
            console.log(`${error.code} ${error.message}`)
        });
}




const editToggle = () => {
    let userProfile = document.getElementById("userProfile").disabled;
    let statusProfile = document.getElementById("statusProfile").disabled;
    let saveModal = document.getElementById("saveModal").disabled;
    let profilePhoto = document.getElementById("photo").disabled;


    if (userProfile && emailProfile && statusProfile && saveModal && profilePhoto) {
        document.getElementById("userProfile").disabled = false;
        document.getElementById("statusProfile").disabled = false;
        document.getElementById("saveModal").disabled = false;
        document.getElementById("photo").disabled = false;
    }
    else {
        const usr = firebase.auth().currentUser;

        document.getElementById("userProfile").disabled = true;
        document.getElementById("statusProfile").disabled = true;
        document.getElementById("saveModal").disabled = true;
        document.getElementById("photo").disabled = true;
        db
            .doc(`users/${usr.uid}`)
            .get()
            .then(doc => {
                document.getElementById("userProfile").innerHTML = doc.data().userName;
                document.getElementById("statusProfile").innerHTML = doc.data().about;
            })
            .catch(error => {
                console.log(error)
            })
    }

}

const updateProfile = () => {
    const usr = firebase.auth().currentUser;
    let userProfile = document.getElementById("userProfile");
    let statusProfile = document.getElementById("statusProfile");

    if (userProfile == !/^(\w+\S+)$/ || statusProfile == !/^(\w+\S+)$/) {
        alert("Todos los campos son obligatorios")
    }
    else {
        db.collection("users").doc(usr.uid).update({
            about: statusProfile.value,
            email: emailProfile.value,
            userName: userProfile.value
        })
    }

}


const uploadFile = () => {
    const ref = firebase.storage().ref()
    const usr = firebase.auth().currentUser;
    let file = document.getElementById("photo").files[0]


    if (file == null) {
        alert("Debe seleccionar una foto")
    }
    else {
        const fileName = file.name
        const task = ref.child(fileName).put(file);
        task
            .then(snapshot => snapshot.ref.getDownloadURL()).then(res => {
                db.collection("users").doc(usr.uid).update({
                    photo: res
                })
            })
    }

}

const deleteFile = () => {
    const usr = firebase.auth().currentUser;
    let profilePhoto = document.getElementsByClassName("profile-photo");
    profilePhoto[0].src = "/Images/Not-file.png"
    profilePhoto[1].src = "/Images/Not-file.png"

    db.collection("users").doc(usr.uid).update({
        photo: "/Images/Not-file.png"
    })

}

const friendProfile = (id) => {
    document.getElementsByClassName("btn-success").disabled
    let username = document.getElementById("userFriend");
    let emailProfile = document.getElementById("emailFriend");
    let profilePhoto = document.getElementById("friendPhoto")
    let about = document.getElementById("statusFriend");
    db
        .doc(`users/${id}`)
        .get()
        .then(function (doc) {
            username.value = doc.data().userName
            emailProfile.value = doc.data().email
            profilePhoto.src = doc.data().photo
            about.innerHTML = doc.data().about
        })
        .catch(function (error) {
            alert(`${error.message} ${error.code}`)

        })

}