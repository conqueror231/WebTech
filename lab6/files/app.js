
let state = {
  products: [],          
  activeFilter: null,    
  activeSort: null,      
  nextId: 1             
};


const createProduct = (id, name, price, category, image) => ({
  id,
  name,
  price: parseFloat(price),
  category,
  image,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const updateProductInList = (products, id, fields) =>
  products.map(p =>
    p.id === id ? { ...p, ...fields, updatedAt: new Date().toISOString() } : p
  );

const removeProductFromList = (products, id) =>
  products.filter(p => p.id !== id);

const filterProducts = (products, category) =>
  category ? products.filter(p => p.category === category) : products;

const sortProducts = (products, field) => {
  if (!field) return products;
  return [...products].sort((a, b) => {
    if (field === 'price') return a.price - b.price;
    return new Date(a[field]) - new Date(b[field]);
  });
};

const calcTotal = (products) =>
  products.reduce((sum, p) => sum + p.price, 0);

const getCategories = (products) =>
  [...new Set(products.map(p => p.category))];


const render = () => {
  const filtered = filterProducts(state.products, state.activeFilter);
  const sorted = sortProducts(filtered, state.activeSort);

  renderProductList(sorted);
  renderTotal(state.products); 
  renderFilterButtons(getCategories(state.products));
};

const renderProductList = (products) => {
  const list = document.getElementById('product-list');
  const emptyMsg = document.getElementById('empty-message');

  emptyMsg.style.display = state.products.length === 0 ? 'block' : 'none';

  list.innerHTML = ''; 

  products.forEach(product => {
    const li = document.createElement('li');
    li.className = 'product-card';
    li.dataset.id = product.id;

    li.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/220x140?text=No+Image'" />
      <p><strong>ID:</strong> ${product.id}</p>
      <p><strong>Назва:</strong> ${product.name}</p>
      <p><strong>Ціна:</strong> ${product.price} грн</p>
      <p><strong>Категорія:</strong> ${product.category}</p>
      <div class="card-buttons">
        <button onclick="handleDelete(${product.id})">Видалити</button>
        <button onclick="handleEdit(${product.id})">Редагувати</button>
      </div>
    `;

    list.appendChild(li);
  });
};

const renderTotal = (products) => {
  document.getElementById('total-value').textContent =
    calcTotal(products).toFixed(2);
};

const renderFilterButtons = (categories) => {
  const container = document.getElementById('filter-buttons');
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.textContent = 'Усі';
  allBtn.onclick = () => handleFilter(null);
  container.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.onclick = () => handleFilter(cat);
    container.appendChild(btn);
  });
};

const openAddModal = () => {
  document.getElementById('modal-title').textContent = 'Додати товар';
  document.getElementById('edit-id').value = '';
  document.getElementById('product-form').reset();
  document.getElementById('form-error').textContent = '';
  document.getElementById('modal-overlay').classList.remove('hidden');
};

const handleEdit = (id) => {
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('modal-title').textContent = 'Редагувати товар';
  document.getElementById('edit-id').value = id;
  document.getElementById('field-name').value = product.name;
  document.getElementById('field-price').value = product.price;
  document.getElementById('field-category').value = product.category;
  document.getElementById('field-image').value = product.image;
  document.getElementById('form-error').textContent = '';
  document.getElementById('modal-overlay').classList.remove('hidden');
};

const closeModal = () => {
  document.getElementById('modal-overlay').classList.add('hidden');
};

document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

document.getElementById('product-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const name     = document.getElementById('field-name').value.trim();
  const price    = document.getElementById('field-price').value;
  const category = document.getElementById('field-category').value;
  const image    = document.getElementById('field-image').value.trim();
  const editId   = document.getElementById('edit-id').value;

  if (!name || !price || !category || !image) {
    document.getElementById('form-error').textContent = 'Заповніть усі поля!';
    return;
  }

  if (editId) {
    const id = parseInt(editId);
    state = {
      ...state,
      products: updateProductInList(state.products, id, { name, price: parseFloat(price), category, image })
    };
    showSnackbar(`✏️ Товар #${id} "${name}" оновлено`);
  } else {
    const newProduct = createProduct(state.nextId, name, price, category, image);
    state = {
      ...state,
      products: [...state.products, newProduct],
      nextId: state.nextId + 1
    };
    showSnackbar('✅ Товар успішно додано');
  }

  closeModal();
  render();
});

const handleDelete = (id) => {
  const card = document.querySelector(`[data-id="${id}"]`);

  if (card) {
    card.classList.add('removing');
    setTimeout(() => {
      state = {
        ...state,
        products: removeProductFromList(state.products, id)
      };
      showSnackbar('🗑️ Товар успішно видалено зі списку');
      render();
    }, 300);
  }
};

// 
const handleFilter = (category) => {
  state = { ...state, activeFilter: category };
  render();
};

const handleSort = (field) => {
  state = { ...state, activeSort: field };
  render();
};


let snackbarTimer = null;

const showSnackbar = (message) => {
  const snackbar = document.getElementById('snackbar');
  snackbar.textContent = message;
  snackbar.classList.remove('hidden');

  if (snackbarTimer) clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() => {
    snackbar.classList.add('hidden');
  }, 3000);
};

const seedProducts = [
  createProduct(1, 'Ноутбук Asus', 25000, 'Електроніка', 'https://cdn.synthetic.com.ua/media/assets/images/6/5/1/0/e/f/9/4/2/5/e/a/4/2/d/b/1600x1600/6510ef9425ea42dba56974ee81f63c01.png'),
  createProduct(2, 'Футболка Nike', 850,   'Одяг',       'https://sportano.ua/img/986c30c27a3d26a3ee16c136f92f4ff5/1/9/197596715378_20-jpg/futbolka-ditjacha-nike-sportswear-cropped-black-1318068.jpg'),
  createProduct(3, 'Молоко 1л',    45,     'Продукти',   'https://content2.rozetka.com.ua/goods/images/big/654289535.webp'),
  createProduct(4, 'Стіл дерев\'яний', 3200, 'Меблі',    'https://mebliskif.com.ua/images/category/1980/mjake-krislo-bruno-horikh-dzhersi-16-18780.jpg'),
];

state = {
  ...state,
  products: seedProducts,
  nextId: 5
};

render();
