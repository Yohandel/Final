firebase.auth().onAuthStateChanged(function (user) {
    let username = document.getElementById("userName");
    let userProfile = document.getElementById("userProfile");
    let emailProfile = document.getElementById("emailProfile");
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
                });
            })
            .catch(function (error) {

            })
    } else {
        document.getElementById("userName").innerHTML = ``
    }
});


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
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
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
    let emailProfile = document.getElementById("emailProfile").disabled;
    let statusProfile = document.getElementById("statusProfile").disabled;
    let saveModal = document.getElementById("saveModal").disabled;

if (userProfile && emailProfile && statusProfile && saveModal) {
    userProfile = document.getElementById("userProfile").disabled = false;
    emailProfile = document.getElementById("emailProfile").disabled = false;
    statusProfile = document.getElementById("statusProfile").disabled = false;
    saveModal = document.getElementById("saveModal").disabled = false;
}
else{
    userProfile = document.getElementById("userProfile").disabled = true;
    emailProfile = document.getElementById("emailProfile").disabled = true;
    statusProfile = document.getElementById("statusProfile").disabled = true;
    saveModal = document.getElementById("saveModal").disabled = true;
}

}