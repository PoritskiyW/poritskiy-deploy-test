function isValid(data) {
  const { email, password } = data;
  const regEmail = /^[a-z0-9_-]{2,64}@[a-z0-9_-]{2,63}\.[a-z0-9_-]{2,63}$/;
  const regPassword = /(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}/;

  if(!regEmail.test(email) || !regPassword.test(password)) {
    return false;
  }
  return true;
}

function submitHandler(event) {
  event.preventDefault();
  const data = {}

  data.email = document.getElementById('email').value.toLowerCase();
  data.password = document.getElementById('password').value;

  if(isValid(data)) {
    fetch('/authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => {
      window.location.href = response.url;
    })
  } else {
    document.getElementById('errorMessage').innerText = 'Почта или пароль не валидны';
  }
}

window.onload = () => {
  document.getElementById('signInForm').addEventListener('submit', submitHandler);
}
