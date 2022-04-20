function addListener(id, type, callback) {
  const node = document.getElementById(id);

  if (node) {
    node.addEventListener(type, callback);
    return true;
  }
  return false;
}

function addServiceHandler(state) {
  const serviceName = document.getElementById('service').value;
  const type = document.getElementById('serviceType').value;
  const cost = document.getElementById('cost').value;

  if(!serviceName.length || !type.length || !cost.length) {
    alert('Заполните поля');
    return false;
  }

  const service = {
    service: serviceName,
    type: type,
    cost: cost
  }
  state.services.push(service);

  renderServicesList(state);
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

function saveButtonHandler(state) {
  const cleanerName = document.getElementById('cleanerName').value;
  const description = document.getElementById('description').value;

  if (!cleanerName.length || !description.length) {
    alert('Заполните необходимые поля');
    return false;
  }
  const formData = new FormData();
  formData.append('cleanerName', cleanerName);
  formData.append('description', description);
  formData.append('services', JSON.stringify(state.services));
  const images = document.getElementById('images').files;

  for (let index = 0; index < images.length; index++) {
    const element = images[index];
    formData.append('files', element);
  }

  try {
    fetch(window.location.href, {
      method: 'POST',
      body: formData
    }).then((response) => {
      window.location.href = response.url;
    });
  } catch (err) {
    console.error(err);
  }
}

function renderImagesPreview() {
  const images = document.getElementById('images').files;
  let reader = [];
  let name;
  const preview = document.getElementById('preview');

  for (const i in images) {

    if (images.hasOwnProperty(i)) {
      name = 'file' + i;
      reader[i] = new FileReader();
      reader[i].readAsDataURL(images[i]);
      preview.innerHTML += '<img id="'+ name +'" src="" class="image-preview" />';

      (function (name) {
        reader[i].onload = function (e) {
          document.getElementById(name).src = e.target.result;
        };
      })(name);
    }
  }
}

function renderServicesList(state) {
  const list = document.getElementById('servicesList');
  list.innerHTML = '';
  let rendered = '';

  if (state.services.length !== 0) {
    state.services.forEach((element, index) => {
      const serviceTemplate = `
      <li class="service-list__item item">
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

  const creationTemplate = `
  <li class="service-list__item item" id="creationLi">
    <label>Услуга
      <input class="item__param" type="text" id="service"/>
    </label>
    <label>Тип услуги
      <input class="item__param" type="text" id="serviceType"/>
    </label>
    <label>Стоимость
      <input class="item__param" type="number" id="cost"/>
    </label>
    <label>
      <input class="item__button" type="button" value="Добавить услугу" id="addService"/>
    </label>
  </li>`
  list.innerHTML += creationTemplate;

  addListener('addService', 'click', addServiceHandler.bind(null, state));
}

function init() {
  const state = {
    cleanerName: null,
    description: null,
    services: []
  }

  addListener('addService', 'click', addServiceHandler.bind(null, state));
  addListener('submit', 'click', saveButtonHandler.bind(null, state));
  addListener('servicesList', 'click', deleteButtonHandler.bind(null, state));
  addListener('images', 'change', renderImagesPreview);
}

window.onload = () => {
  init()
}

