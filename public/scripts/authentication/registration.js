function isValid(data) {
  const { email, password, passwordConfirmation, role } = data;
  const regEmail = /^[a-z0-9_-]{2,64}@[a-z0-9_-]{2,63}\.[a-z0-9_-]{2,63}$/;
  const regPassword = /(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}/
  const roles = ['User', 'Admin'];

  if(!regEmail.test(email) || password !== passwordConfirmation
    || !regPassword.test(password) || !roles.includes(role)) {
    return false;
  }
  return true;
}

function submitHandler(event) {
  event.preventDefault();
  const data = {}

  data.email = document.getElementById('email').value.toLowerCase();
  data.password = document.getElementById('password').value;
  data.passwordConfirmation = document.getElementById('passwordConfirmation').value;
  data.role = document.getElementById('role').value;

  if(isValid(data)) {
    fetch('/registration', {
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
  document.getElementById('registrationForm').addEventListener('submit', submitHandler);
}
