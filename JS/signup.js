function SignUp(evt) {

  evt.preventDefault()
  let username = document.getElementById("userName").value
  let email = document.getElementById("signupEmail").value;
  let password = document.getElementById("signupPassword").value;
  let conPassword = document.getElementById("confirmPassword").value;
  let alert = document.getElementById("errorMessage")

  if (username == !/^(\w+\S+)$/) {
    alert.hidden = false
    alert.innerHTML = `username field is required`
  }
  else if (email == !/^(\w+\S+)$/) {
    alert.hidden = false
    alert.innerHTML = `email field is required`
  }
  else if (password == !/^(\w+\S+)$/) {
    alert.hidden = false
    alert.innerHTML = `password field is required`
  }
  else if (conPassword != password) {
    alert.hidden = false
    alert.innerHTML = `Passwords don't match`
  } else {
    alert.hidden = true
    alert.innerHTML = ``
    sendInformation(username, email, password, conPassword);

  }

}

function sendInformation(username, email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
    createUSR(res.user.uid,res.user.email, username)
  }).catch(function  (error) { 
alert(`${error.message} ${error.code}`)
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(` ${errorMessage} ${errorCode} `)
    // ...
  });
}

function createUSR(uid, email, userName) {

  const gsReference = storage.refFromURL('gs://whtasappproject.appspot.com/Not-file')
  console.log(gsReference.bucket + "/"+gsReference.fullPath)

  console.log(gsReference)

  db.collection("users").doc(uid).set({
    uid: uid,
    userName: userName,
    email: email,
    about:"Hola soy nuevo",
    photo:"/Images/Not-file.png"
  }).then((res) => {
    document.getElementById("userName").value = "";
    document.getElementById("signupEmail").value = "";
    document.getElementById("signupPassword").value = "";
    document.getElementById("confirmPassword").value = "";

  }).catch((err) => {

  });

}