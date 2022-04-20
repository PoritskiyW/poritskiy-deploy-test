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

function updateButtonHandler(state, event) {
  if(event.target.id.includes('update_')) {
    const updateIndex = Number(event.target.id.split('_')[1]);
    const item = document.getElementById(`item_${updateIndex}`);
    const service = state.services[updateIndex];
    item.innerHTML = `
      <label>Услуга
        <input class="item__param service" type="text" value="${service.service}" id="service_${updateIndex}"/>
      </label>
      <label>Тип услуги
        <input class="item__param type" type="text" value="${service.type}" id="type_${updateIndex}"/>
      </label>
      <label>Стоимость
        <input class="item__param cost" type="number" value="${service.cost}" id="cost_${updateIndex}"/>
      </label>
      <label>
        <input class="item__button update" type="button" value="Сохранить" id="save_${updateIndex}"/>
      </label>`;
  }
}

function saveButtonHandler(state, event) {
  if(event.target.id.includes('save_')) {
    const updateIndex = Number(event.target.id.split('_')[1]);
    const service = document.getElementById(`service_${updateIndex}`).value;
    const type = document.getElementById(`type_${updateIndex}`).value;
    const cost = document.getElementById(`cost_${updateIndex}`).value;
    state.services[updateIndex] = {
      service: service,
      type: type,
      cost: cost
    }
    renderServicesList(state);
  }
}

function submitButtonHandler(state) {
  const cleanerName = document.getElementById('cleanerName').value;
  const description = document.getElementById('description').value;

  if (!cleanerName.length || !description.length) {
    alert('Заполните необходимые поля');
    return false;
  }

  let imagesState = []
  state.images.forEach(element => {
    const splitURL = element.split('/');
    const imageLink = '/images/' + splitURL[splitURL.length - 2] + '/' + splitURL[splitURL.length - 1];
    console.log(imageLink);
    imagesState.push(imageLink);
  });

  state.images = imagesState;
  const formData = new FormData();
  formData.append('cleanerName', cleanerName);
  formData.append('description', description);
  formData.append('services', JSON.stringify(state.services));
  formData.append('images', JSON.stringify(state.images));
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

function deleteImageButtonHandler(state, event) {
  if(event.target.id.includes('delete-image_')) {
    const deleteIndex = Number(event.target.id.split('_')[1]);
    state.images = state.images.filter((item, index) => {
      if (index === deleteIndex) {
        return false;
      }
      return true;
    })

    renderGallery(state);
  }
}

function renderGallery(state) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''
  let rendered = '';

  state.images.forEach((element, index) => {
    rendered += `
    <li class="gallery__item"><img class="image image-preview" src="${element}" alt="" id="image_${index}"/>
      <label>
        <input type="button" class="form__button centered" id="delete-image_${index}" value="Удалить"/>
      </label>
    </li>`;
  })
  gallery.innerHTML = rendered;
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
      preview.innerHTML +=
        `<img class="image image-preview" src="" alt="" id="${name}"/>`;

      (function (name) {
        reader[i].onload = function (e, i) {
          const previewImage = document.getElementById(name);
          previewImage.src = e.target.result;
          previewImage.id = `preview_${i}`;
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
          <input class="item__button update" type="button" value="Редактировать" id="update_${index}"/>
        </label>
        <label>
          <input class="item__button delete" type="button" value="Удалить" id="delete_${index}"/>
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
    services: [],
    images: []
  }

  document.querySelectorAll('.image').forEach((element) => {
    state.images.push(element.src);
  })

  document.querySelectorAll('.item').forEach((element) => {
    if (element.id.includes('_')) {
      const index = element.id.split('_')[1];
      const service = {
        service: document.getElementById(`service_${index}`).innerText,
        type: document.getElementById(`type_${index}`).innerText,
        cost: document.getElementById(`cost_${index}`).innerText
      }
      state.services.push(service);
    }
  })

  addListener('addService', 'click', addServiceHandler.bind(null, state));
  addListener('submit', 'click', submitButtonHandler.bind(null, state));
  addListener('servicesList', 'click', deleteButtonHandler.bind(null, state));
  addListener('servicesList', 'click', updateButtonHandler.bind(null, state));
  addListener('servicesList', 'click', saveButtonHandler.bind(null, state));
  addListener('gallery', 'click', deleteImageButtonHandler.bind(null, state));
  addListener('images', 'change', renderImagesPreview);
}

window.onload = () => {
  init()
}
