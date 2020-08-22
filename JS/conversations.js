firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        friends(user.uid)
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
                                    <button class="btn btn-success" onclick = "createConversation('${user.data().uid}','${id}','${friend.data().status}')">Abrir <i class="far fa-comments"></i></button>
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

const createConversation = (user_id, current_id, friendship) => {
    let DBconversations = db.collection("conversations");

    DBconversations
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                if (user_id == doc.data().creator || user_id == doc.data().chatUser) {
                    openConversation(user_id, current_id)
                }

                else {
                    console.log("No")
                    DBconversations
                        .doc(`${current_id}-${user_id}`)
                        .set({
                            creator: current_id,
                            chatUser: user_id,
                            status: friendship
                        })
                        .then(doc => {
                            openConversation(user_id, current_id)
                        })
                        .catch(function (error) {
                            alert(`${error.message} ${error.code}`)
                        })
                }

            });
        })
        .catch(function (error) {

        })

}

const openConversation = (user_id, current_id) => {
    let conversation = document.getElementById("conversation")
    let DBconversations = db.collection("conversations");
    db
        .doc(`users/${user_id}`)
        .get()
        .then(function (user) {
            conversation.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light">
            <div class="conver-nav">
                <div class="row">
                    <div class="col-sm-4"> <a class="navbar-brand" href="#"
                    onclick="friendProfile('${user.id}')"
                     data-toggle="modal" data-target="#friendModal">
                    <img class="rounded-circle" src="${user.data().photo}"alt="">
                    </a></div>
                    <div class="col-sm-8 mt-3"> <label for="">${user.data().userName}</label><br>
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
                        <a class="dropdown-item" href="#" onclick="deleteConver('${user.id}','${current_id}')">Eliminar conversación</a>
                        <a class="dropdown-item" href="/" data-toggle="modal"
                        data-target="#friendModal" onclick="friendProfile('${user.id}')">Ver contacto</a>
                        <a class="dropdown-item" href="#" onclick="closeConver()">Cerrar chat</a>
                    </div>
                </div>
        
        </nav>
        <div class="container conver-container" id= "conver-container">
        
        </div>
        <div class="form-group input-send">
            <div class="input-group mb-2 mr-sm-2">
                <input class="form-control" type="text" name="" id="messageInput" placeholder="Message...">
                <div class="input-group-append">
                        <button class="btn btn-success" onclick = "sendMessage('${user.id}','${current_id}')">SEND <i class="fas fa-paper-plane"></i></button>
                        <button data-toggle="modal" data-target="#sendPicture" class="btn btn-outline-secondary" onclick="loadModal('${user.id}','${current_id}')"><i class="fas fa-camera"></i></button>
                    </div>
            </div>
        </div>`
        })
        .catch(function (error) {
            alert(`${error.message} ${error.code}`)

        })

    DBconversations
        .where("creator", "==", current_id)
        .where("chatUser", "==", user_id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(conver => {
                console.log(conver.data())
                if (user_id == conver.data().chatUser) {

                    DBconversations
                        .doc(conver.id)
                        .collection("messages")
                        .orderBy("timeStamp", "asc")
                        .onSnapshot(querySnapshot => {
                            let conver_container = document.getElementById("conver-container");
                            conver_container.innerHTML = ""
                            querySnapshot.forEach(message => {

                                if (message.data().sender == current_id) {
                                    conver_container.innerHTML += `
                       <div class="message right" id="message-right">
                       ${message.data().body ? `<p>${message.data().body}</p>` :
                                            `<img class="rounded mb-5" src="${message.data().image}">`}

                        <small class="form-text text-muted text-right">
                        ${message.data().time}
                        </small>
                       </div>
                       `
                                }

                                if (message.data().sender == user_id) {
                                    conver_container.innerHTML += `
                       <div class="message left" id="message-left">
                       ${message.data().body ? `<p>${message.data().body}</p>` :
                                            `<img class="rounded mb-5" src="${message.data().image}">`}
                        <small class="form-text text-muted text-left">
                        ${message.data().time}
                        </small>
                       </div>
                       `
                                }

                            });
                        })
                }
            });
        })
        .catch(function (error) {

        })

    DBconversations
        .where("creator", "==", user_id)
        .where("chatUser", "==", current_id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(conver => {
                console.log(conver.data())
                if (current_id == conver.data().chatUser) {

                    DBconversations
                        .doc(conver.id)
                        .collection("messages")
                        .orderBy("timeStamp", "asc")
                        .onSnapshot(querySnapshot => {
                            let conver_container = document.getElementById("conver-container");
                            conver_container.innerHTML = ""
                            querySnapshot.forEach(message => {

                                if (message.data().sender == current_id) {
                                    conver_container.innerHTML += `
                       <div class="message right" id="message-right">
                       ${message.data().body ? `<p>${message.data().body}</p>` :
                                            `<img class="rounded mb-5" src="${message.data().image}">`}
                        <small class="form-text text-muted text-right">
                        ${message.data().time}
                        </small>
                       </div>
                       `
                                }

                                if (message.data().sender == user_id) {
                                    conver_container.innerHTML += `
                       <div class="message left" id="message-left">
                       ${message.data().body ? `<p>${message.data().body}</p>` :
                                            `<img class="rounded mb-5" src="${message.data().image}">`}
                        <small class="form-text text-muted text-left">
                        ${message.data().time}
                        </small>
                       </div>
                       `
                                }

                            });
                        })
                }
            });
        })
        .catch(function (error) {

        })

}

const closeConver = () => {
    document.getElementById("conversation").innerHTML = `<div class="default-bg" id="converBG"></div>`

}

const deleteConver = (user_id, current_id) => {
    let DBconversations = db.collection("conversations");

    let question = window.confirm("¿Está seguro de eliminar este registro?")
    if (question == true) {
        DBconversations
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    if (user_id == doc.data().creator || user_id == doc.data().chatUser) {
                        if (current_id == doc.data().creator || current_id == doc.data().chatUser) {


                            DBconversations
                            .doc(doc.id)
                            .collection("messages")
                            .get()
                            .then(querySnapshot =>{
                                querySnapshot.forEach(message => {
                                    db
                                        .doc(`messages/${message.id}`)
                                        .delete()
                                        .then(function (doc) {
                                    
                                        })
                                        .catch(function (error) {
                                    alert(`${error.message} ${error.code}`)
                                        })
                                });
                            })

                            db
                                .doc(`conversations/${doc.id}`)
                                .delete()
                                .then(function (doc) {
                                    alert("Conversación eliminada")
                                    closeConver();
                                })
                                .catch(function (error) {
                                    alert(`${error.message} ${error.code}`)
                                })

                                
                        }
                    }

                });
            })
            .catch(function (error) {
                alert(`${error.message} ${error.code}`)
            })

    } else {

    }


}

const sendMessage = (user_id, current_id) => {
    let messageBody = document.getElementById("messageInput");
    let DBMessages = db.collection("messages");
    let DBconversations = db.collection("conversations");
    let date = new Date();
    let today = `${date.getDate()}/${date.getMonth()}/${date.getFullYear('yy')}`;
    let time = `${date.getHours()}:${date.getMinutes()}`;

    if (messageBody.value == !/^(\w+\S+)$/) {
        alert("El mensaje no puede estar vacio")
    } else {

        DBconversations
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    if (doc.data().chatUser == user_id || doc.data().creator == user_id) {
                        db
                            .doc(`conversations/${doc.id}`)
                            .collection('messages').doc().set({
                                sender: current_id,
                                receiver: user_id,
                                body: messageBody.value,
                                date: today,
                                time: time,
                                timeStamp: firebase.firestore.FieldValue.serverTimestamp()
                            })
                    }
                });
                document.getElementById("messageInput").value = ""
            })
            .catch(function (error) {

            })
    }



}

const loadModal = (user_id, current_id) => {
    document.getElementById("imageModal").innerHTML = `
<div class="profile-picture">
<img class="rounded mb-5" src="/Images/Not-file.png" alt="" id="messageImage">
</div>
<div class="input-group mb-3">
<div class="custom-file">
    <div class="input-group-prepend">
        <button disabled class="btn btn-success btn-sm btn-file" id="btn_upload" type="button"
            onclick="sendPicture('${user_id}','${current_id}')">Upload</button>
    </div>
    <input onchange="preView()"  type="file" class="custom-file-input form-control-sm" id="imageInput"
        aria-describedby="inputGroupFileAddon03">
    <label class="custom-file-label" for="photo">Choose file...</label>
</div>
</div>
`
}

const preView = () => {
    const ref = firebase.storage().ref()
    const usr = firebase.auth().currentUser;
    let file = document.getElementById("imageInput").files[0]
    document.getElementById("btn_upload").disabled = true
    document.getElementById("btn_upload").innerHTML = `<i class="fas fa-spinner"></i>`


    if (file == null) {
        alert("Debe seleccionar una foto")
    }
    else {
        const fileName = file.name
        const task = ref.child(fileName).put(file);
        task
            .then(snapshot => snapshot.ref.getDownloadURL()).then(res => {
                document.getElementById("messageImage").src = res
                document.getElementById("btn_upload").innerHTML = "Upload"
                document.getElementById("btn_upload").disabled = false
            })
    }

}


const sendPicture = (user_id, current_id) => {
    let DBconversations = db.collection("conversations");
    let date = new Date();
    let today = `${date.getDate()}/${date.getMonth()}/${date.getFullYear('yy')}`;
    let time = `${date.getHours()}:${date.getMinutes()}`;
    const ref = firebase.storage().ref()
    const usr = firebase.auth().currentUser;
    let file = document.getElementById("imageInput").files[0]


    if (file == null) {
        alert("Debe seleccionar una foto")
    }
    else {
        const fileName = file.name
        const task = ref.child(fileName).put(file);
        task
            .then(snapshot => snapshot.ref.getDownloadURL()).then(res => {
                DBconversations
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            console.log(doc.data())
                            if (doc.data().chatUser == user_id || doc.data().creator == user_id) {

                                DBconversations
                                    .doc(doc.id)
                                    .collection('messages').doc().set({
                                        sender: current_id,
                                        receiver: user_id,
                                        image: res,
                                        date: today,
                                        time: time,
                                        timeStamp: firebase.firestore.FieldValue.serverTimestamp()
                                    }).then(re => {
                                        alert("Imagen enviada")
                                    })
                                    .catch(error => {
                                        alert(error.message)
                                    })
                            }
                        });
                        document.getElementById("messageInput").value = ""
                    })
                    .catch(function (error) {
                        alert(`${erro.message} ${error.code}`)
                    })
            })
    }



}



