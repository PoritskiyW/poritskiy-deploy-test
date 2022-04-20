function deleteButtonHandler(id) {
  console.log(id, `/cleaner/${id}`);
  fetch(`/cleaner/${id}`, {
    method: 'DELETE'
  }).then((response) => {
    window.location.href = response.url;
  })
}

function updateButtonHandler(id) {
  location = `/cleaner/${id}`
}

function init() {
  const deleteButtons = document.querySelectorAll('input.delete');
  deleteButtons.forEach((element) => {
    element.addEventListener('click', deleteButtonHandler.bind(null, element.id.split('_')[1]));
  })
  const updateButtons = document.querySelectorAll('input.update');
  updateButtons.forEach((element) => {
    element.addEventListener('click', updateButtonHandler.bind(null, element.id.split('_')[1]));
  })
}

window.onload = () => {
  init();
}
