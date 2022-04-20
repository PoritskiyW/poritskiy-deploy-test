function addListener(id, type, callback) {
  const node = document.getElementById(id);

  if (node) {
    node.addEventListener(type, callback);
    return true;
  }
  return false;
}

function deleteButtonHandler(state, event) {
  if(event.target.id.includes('delete_')) {
    const deleteIndex = Number(event.target.id.split('_')[1]);
    state.ordered = state.ordered.filter((item, index) => {
      if (index === deleteIndex) {
        state.userCash += item.cost;
        return false;
      }
      return true;
    })

    renderOrderedList(state);
  }
}

function saveButtonHandler(state) {
  console.log(state);
  const data = {
    userCash: state.userCash,
    ordered: state.ordered
  }

  try {
    fetch(window.location.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => {
      window.location.href = response.url;
    });
  } catch (err) {
    console.error(err);
  }
}

function renderOrderedList(state) {
  const order = document.getElementById('orderedList');
  let rendered = '';
  order.innerHTML = '';

  if (state.ordered.length !== 0) {
    state.ordered.forEach((element, index) => {
      const serviceTemplate = `
      <li class="order-list__item item">
        <label>Услуга
          <p class="item__param service" id="service_${index}">${element.service}</p>
        </label>
        <label>Тип услуги
          <p class="item__param type" id="type_${index}">${element.type}</p>
        </label>
        <label>Стоимость
          <p class="item__param cost" id="cost_${index}">${element.cost}</p>
        </label>
        <label>
          <input class="form__button delete" type="button" value="Удалить" id="delete_${index}"/>
        </label>
      </li>`

      rendered += serviceTemplate;
    });
    order.innerHTML = rendered;
  }
}

function addToOrderHandler(state, event) {
  if (event.target.id.includes("addService_")) {
    const index = event.target.id.split('_')[1];
    const service = state.services[index];
    if (state.userCash - service.cost <= 0) {
      alert('Недостаточно средств')
    } else {
      state.userCash = state.userCash - service.cost;
      state.ordered.push(service);
    }
    renderOrderedList(state);
  }
}

function init() {
  const state = {
    userCash: 0,
    ordered: [],
    services: []
  }

  document.querySelectorAll('.item').forEach((element) => {
    const index = element.id.split('_')[1];
    const service = {
      service: document.getElementById(`service_${index}`).innerText,
      type: document.getElementById(`type_${index}`).innerText,
      cost: Number(document.getElementById(`cost_${index}`).innerText)
    }
    state.services.push(service);
  })

  state.userCash = Number(document.getElementById('user-cash').innerText);

  addListener('orderedList', 'click', deleteButtonHandler.bind(null, state));
  addListener('servicesList', 'click', addToOrderHandler.bind(null, state));
  addListener('saveOrder', 'click', saveButtonHandler.bind(null, state));
}

window.onload = () => {
  init()
}
