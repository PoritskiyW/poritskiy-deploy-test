function addListener(id, type, callback) {
  const node = document.getElementById(id);

  if (node) {
    node.addEventListener(type, callback);
    return true;
  }
  return false;
}

function addServiceHandler(state, event) {
  if(event.target.id.includes('add_')) {
    const addIndex = Number(event.target.id.split('_')[1]);
    console.log('index', addIndex);
    state.services.push(state.available[addIndex]);
    renderServicesList(state);
  }
}

function renderReturnCause(state, event) {
  state.status= Number(event.target.value);
  if(event.target.value === '2') {
    const cause = document.createElement('label')
    cause.id = 'cause';
    cause.innerHTML = '<textarea id="returnCause" name="", cols="30", rows="10"></textarea>';
    document.body.appendChild(cause);
  } else {
    const node = document.getElementById('returnCause');
    if(node) {
      const parent = node.parentElement;
      parent.removeChild(node);
    }
  }
}

function deleteButtonHandler(state, event) {
  if(event.target.id.includes('delete_')) {
    const deleteIndex = Number(event.target.id.split('_')[1]);
    state.services = state.services.filter((item, index) => {
      if (index === deleteIndex) {
        return false;
      }
      return true;
    })
    renderServicesList(state);
  }
}

function submitButtonHandler(state) {
  const data = {
    services: state.services,
    status: state.status
  }

  const cause = document.getElementById('returnCause');
  if (cause) {
    data.returnCause = cause.innerText;
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


function renderServicesList(state) {
  const list = document.getElementById('order');
  list.innerHTML = '';
  let rendered = '';
  console.log(state);

  if (state.services.length !== 0) {
    state.services.forEach((element, index) => {
      const serviceTemplate = `
      <li class="service-list__item item" id="${index}">
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
          <input class="item__button delete" type="button" value="Удалить услугу" id="delete_${index}"/>
        </label>
      </li>`

      rendered += serviceTemplate;
    });
    list.innerHTML = rendered;
  }
}

function init() {
  const state = {
    services: [],
    available: [],
    status: 0,
  }

  document.querySelectorAll('.item').forEach((element) => {
    if (element.id.includes('_') && element.classList.contains('order-list__item')) {
      const index = element.id.split('_')[1];
      const service = {
        service: document.getElementById(`service_${index}`).innerText,
        type: document.getElementById(`type_${index}`).innerText,
        cost: document.getElementById(`cost_${index}`).innerText
      }
      state.services.push(service);
    } else {
      const index = element.id.split('_')[1];
      const service = {
        service: document.getElementById(`serviceRefer_${index}`).innerText,
        type: document.getElementById(`typeRefer_${index}`).innerText,
        cost: document.getElementById(`costRefer_${index}`).innerText
      }
      state.available.push(service);
    }

  })

  console.log(state);

  addListener('status', 'change', renderReturnCause.bind(null, state));
  addListener('order', 'click', deleteButtonHandler.bind(null, state));
  addListener('servicesList', 'click', addServiceHandler.bind(null, state));
  addListener('submit', 'click', submitButtonHandler.bind(null, state));
}

window.onload = () => {
  init()
}
