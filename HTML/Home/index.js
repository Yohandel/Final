firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        let username = document.getElementById("userName");
        let userProfile = document.getElementById("userProfile");
        let emailProfile = document.getElementById("emailProfile");
        let profilePhoto = document.getElementsByClassName("rounded-circle")
        let about = document.getElementById("statusProfile")
        let currentU = firebase.auth().currentUser;

        db.collection("users")
        .where("email", "==", currentU.email)
        .onSnapshot(querySnapshot =>{
            querySnapshot.forEach(doc => {
                username.innerHTML = doc.data().userName
                userProfile.value = doc.data().userName
                emailProfile.value = doc.data().email
                about.innerHTML = doc.data().about
                profilePhoto[0].src = doc.data().photo
                profilePhoto[1].src = doc.data().photo
                loadContacts();
            });
        })
    
    } else {
        window.location.href = "/HTML/Login";
    }
});


const loadContacts = () => {
    const usr = firebase.auth().currentUser;
    let contacts = document.getElementById("contacts");

    db.collection("users").onSnapshot(querySnapshot => {
        contacts.innerHTML = ``
        querySnapshot.forEach(doc => {
            if (doc.data().email != usr.email) {
                contacts.innerHTML += `
         <li class="contact">
         <div class="container contact-container">
             <div class="row">
                 <div class="col-sm-3" onclick="openChat('${doc.id}')"> <img class="rounded-circle" src="${doc.data().photo}" alt="" height="40" width="40"></div>
                 <div class="col-sm-7" onclick="openChat('${doc.id}')"> <label for="">${doc.data().userName}</label><br>
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
                             <a class="dropdown-item" href="#">Eliminar chat</a>
                             <a class="dropdown-item" href="#" data-toggle="modal"
                             data-target="#frienModal" onclick="friendProfile('${doc.id}')">Ver contacto</a>
                             <a class="dropdown-item" href="#">Bloquear contacto</a>
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

const logout = () => {
    firebase.auth().signOut()
        .then(res => {
            console.log(res)
        }).catch(function (error) {
            console.log(`${error.code} ${error.message}`)
        });
}

const openChat = (id) => {
    let chat = document.getElementById("chat")

    db
        .doc(`users/${id}`)
        .get()
        .then(function (doc) {
            chat.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light">
            <div class="chat-nav">
                <div class="row">
                    <div class="col-sm-4"> <a class="navbar-brand" href="#"
                    onclick="friendProfile('${doc.id}')"
                     data-toggle="modal" data-target="#frienModal">
                    <img class="rounded-circle" src="${doc.data().photo}"alt="">
                    </a></div>
                    <div class="col-sm-8 mt-3"> <label for="">${doc.data().userName}</label><br>
                    </div>
                </div>
            </div>
                <ul class="navbar-nav mr-auto">
                </ul>
                <div class="dropdown dropleft">
                    <button class="btn btn-circle" type="button" id="dropdownMenuButton" display="dinamic"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-angle-down"></i>
                    </button>
                    <div class="dropdown-menu navs-dropMenu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#">Bloquear</a>
                        <a class="dropdown-item" href="#">Vaciar chat</a>
                        <a class="dropdown-item" href="/" data-toggle="modal"
                        data-target="#frienModal" onclick="friendProfile('${doc.id}')">Ver contacto</a>
                        <a class="dropdown-item" href="#" onclick="closeChat()">Cerrar chat</a>
                    </div>
                </div>
        
        </nav>
        <div class="container chat-container">
            <div class="bg"></div>
            <div class="message left">
                <p>Lorem ipsum dolor sit amet consectetur, Adipisci quidem ut nam aspernatur! Accusantium, omnis
                    explicabo.</p>
            </div>
            <div class="message right">
                <p>Lorem ipsum dolor sit amet consectetur, Adipisci quidem ut nam aspernatur! Accusantium, omnis
                    explicabo.</p>
            </div>
        
        </div>
        <div class="form-group input-send">
            <div class="input-group mb-2 mr-sm-2">
                <div class="input-group-prepend">
                    <button class="btn btn-outline-success">SEND <i class="fas fa-paper-plane"></i></button>
                </div>
                <input class="form-control" type="text" name="" id="messageInput" placeholder="Message...">
            </div>
        </div>`
        })
        .catch(function (error) {

        })

}


const closeChat = () => {
    document.getElementById("chat").innerHTML = `<div class="default-bg" id="chatBG"></div>`

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
    let profilePhoto = document.getElementsByClassName("rounded-circle");
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

        })

}