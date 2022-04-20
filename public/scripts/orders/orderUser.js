function addListener(id, type, callback) {
  const node = document.getElementById(id);

  if (node) {
    node.addEventListener(type, callback);
    return true;
  }
  return false;
}

function endOrderHandler() {
  try {
    fetch(window.location.href, {
      method: 'DELETE',
    }).then((response) => {
      window.location.href = response.url;
    });
  } catch (err) {
    console.error(err);
  }
}

function init() {
  addListener('endOrder', 'click', endOrderHandler);
}

window.onload = () => {
  init()
}
