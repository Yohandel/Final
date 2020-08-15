firebase.auth().onAuthStateChanged(function (user) {
    let username = document.getElementById("userName");
    let userProfile = document.getElementById("userProfile");
    let emailProfile = document.getElementById("emailProfile");
    let profilePhoto = document.getElementsByClassName("rounded-circle")
    let about =  document.getElementById("statusProfile")
    if (user) {
        let currentU = firebase.auth().currentUser;
        db
            .collection("users")
            .where("email", "==", currentU.email)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    username.innerHTML = `${doc.data().userName}`
                    userProfile.value = doc.data().userName
                    emailProfile.value = doc.data().email
                    profilePhoto[0].src = doc.data().photo
                    profilePhoto[1].src = doc.data().photo
                    about.innerHTML = doc.data().about
                });
            })
            .catch(function (error) {

            })
            loadContacts();
    } else {
        window.location.href = "/HTML/Login";
    }
});


const loadContacts = () =>{
const usr =  firebase.auth().currentUser;
let contacts = document.getElementById("contacts");
db
    .collection("users")
    .get()
    .then(function (querySnapshot) {
        querySnapshot.forEach(doc=> {
            contacts.innerHTML=``
            if (doc.data().email != usr.email) {
                console.log(doc.data().email)
                contacts.innerHTML=`
                <li class="contact">
                <div class="container contact-container" onclick="openChat()">
                    <div class="row">
                        <div class="col-sm-2"> <i class="fa fa-user-circle" id="friendIcon"></i></div>
                        <div class="col-sm-8"> <label for="">Ramon Antonio</label><br>
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
                                    <a class="dropdown-item" href="#">Ver contacto</a>
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
    .catch(function (error) {

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

const openChat = () => {
    document.getElementById("chat").innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light">
    <div class="chat-nav">
        <div class="row">
            <div class="col-sm-3"> <a class="navbar-brand" href="#"><i class="fa fa-user"
                        id="userIcon"></i></a></div>
            <div class="col-sm-9 mt-2"> <label for="">Ramon Antonio</label><br>
            </div>
        </div>
    </div>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
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
                <a class="dropdown-item" href="#">Ver contacto</a>
                <a class="dropdown-item" href="#" onclick="closeChat()">Cerrar chat</a>
            </div>
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
    let profilePhoto = document.getElementsByClassName("rounded-circle")


    if (file == null) {
        alert("Debe seleccionar una foto")
    }
    else {
        const fileName = file.name
        const task = ref.child(fileName).put(file);
        task
            .then(snapshot => snapshot.ref.getDownloadURL()).then(res => {
                profilePhoto[0].src = res
                profilePhoto[1].src = res
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