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

function sendInformation(username, email, password, conPassword) {

  firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
    console.log(res.user.email)
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(` ${errorMessage} ${errorCode} `)
    // ...
  });
  username = ""
  email = ""
  password = ""
  conPassword = ""
}


function signIn(evt) {
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;
  let alert = document.getElementById("errorMessage")
  evt.preventDefault()

  if (email == !/^(\w+\S+)$/) {
    alert.hidden = false
    alert.innerHTML = `email field is required`
  }
  else if (password == !/^(\w+\S+)$/) {
    alert.hidden = false
    alert.innerHTML = `password field is required`
  }
  else {
    alert.hidden = true
    alert.innerHTML = ``
    firebase.auth().signInWithEmailAndPassword(email, password).then(res =>{
      console.log(res)
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(`${errorMessage} ${errorCode}`)
      // ...
    });

  }

  


}