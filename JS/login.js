function signIn(evt) {
  evt.preventDefault()
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;
  let alert = document.getElementById("errorMessage")

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
    firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
      window.location.href = "/HTML/Home";
    }).catch(error => {
      console.log(error)
      window.alert(`${error.message}${error.code}`)
    });

  }




}