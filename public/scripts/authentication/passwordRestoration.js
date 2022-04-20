function isValid(data) {
  const { email, password } = data;
  const regEmail = /^[a-z0-9_-]{2,64}@[a-z0-9_-]{2,63}\.[a-z0-9_-]{2,63}$/;

  if(!regEmail.test(email)) {
    return false;
  }
  return true;
}

function submitHandler(event) {
  event.preventDefault();
  const data = {}

  data.email = document.getElementById('email').value.toLowerCase();

  if(isValid(data)) {
    fetch('/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => {
      window.location.href = response.url;
    })
  } else {
    document.getElementById('errorMessage').innerText = 'Почта не валидна';
  }
}

window.onload = () => {
  document.getElementById('restorationForm').addEventListener('submit', submitHandler);
}
